#!/usr/bin/env python3
"""
Seek.com.au Job Scraper for Business Analyst Positions
Scrapes job listings across Australia with focus on Business Analyst roles
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import random
from urllib.parse import urljoin, urlparse
import re
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SeekJobScraper:
    def __init__(self):
        self.base_url = "https://www.seek.com.au"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.jobs = []

    def search_jobs(self, keyword="Business Analyst", location="Australia", max_pages=5):
        """
        Search for jobs on Seek.com.au
        """
        logger.info(f"Searching for '{keyword}' jobs in {location}")

        for page in range(1, max_pages + 1):
            try:
                # Construct search URL
                search_url = f"{self.base_url}/{keyword.replace(' ', '-')}-jobs"

                if page > 1:
                    search_url += f"?page={page}"

                logger.info(f"Scraping page {page}: {search_url}")

                response = self.session.get(search_url, timeout=10)
                response.raise_for_status()

                soup = BeautifulSoup(response.content, 'html.parser')

                # Find job listings
                job_cards = soup.find_all('article', {'data-testid': 'job-card'})

                if not job_cards:
                    logger.info(f"No more jobs found on page {page}")
                    break

                for job_card in job_cards:
                    job_data = self.extract_job_data(job_card)
                    if job_data:
                        self.jobs.append(job_data)

                # Rate limiting
                time.sleep(random.uniform(1, 3))

            except Exception as e:
                logger.error(f"Error scraping page {page}: {e}")
                continue

        logger.info(f"Found {len(self.jobs)} jobs")
        return self.jobs

    def extract_job_data(self, job_card):
        """
        Extract job information from a job card element
        """
        try:
            # Job title and link
            title_elem = job_card.find('a', {'data-testid': 'job-card-title'})
            if not title_elem:
                return None

            title = title_elem.get_text(strip=True)
            job_url = urljoin(self.base_url, title_elem['href'])

            # Company name
            company_elem = job_card.find('span', {'data-testid': 'job-card-company'})
            company = company_elem.get_text(strip=True) if company_elem else "Not specified"

            # Location
            location_elem = job_card.find('span', {'data-testid': 'job-card-location'})
            location = location_elem.get_text(strip=True) if location_elem else "Not specified"

            # Salary (if available)
            salary_elem = job_card.find('span', {'data-testid': 'job-card-salary'})
            salary = salary_elem.get_text(strip=True) if salary_elem else "Not specified"

            # Job type and work arrangement
            job_type_elem = job_card.find('span', {'data-testid': 'job-card-badge'})
            job_type = job_type_elem.get_text(strip=True) if job_type_elem else "Full-time"

            # Posted date
            posted_elem = job_card.find('span', {'data-testid': 'job-card-date'})
            posted_date = posted_elem.get_text(strip=True) if posted_elem else "Recently"

            # Generate unique ID
            job_id = f"seek_{hash(job_url) % 1000000}"

            return {
                'id': job_id,
                'title': title,
                'company': company,
                'location': location,
                'salary': salary,
                'job_type': job_type,
                'posted_date': posted_date,
                'url': job_url,
                'description': '',  # Will be filled by detailed scraping
                'requirements': '',  # Will be filled by detailed scraping
                'scraped_at': datetime.now().isoformat(),
                'source': 'seek.com.au'
            }

        except Exception as e:
            logger.error(f"Error extracting job data: {e}")
            return None

    def get_job_details(self, job_url, max_retries=3):
        """
        Get detailed job information from individual job page
        """
        for attempt in range(max_retries):
            try:
                response = self.session.get(job_url, timeout=10)
                response.raise_for_status()

                soup = BeautifulSoup(response.content, 'html.parser')

                # Extract job description
                desc_elem = soup.find('div', {'data-testid': 'job-description'})
                description = desc_elem.get_text(strip=True) if desc_elem else ""

                # Extract requirements/responsibilities
                requirements = ""

                # Look for common requirement sections
                requirement_sections = soup.find_all(['div', 'section'], string=re.compile(r'(requirements|responsibilities|skills|qualifications)', re.I))

                for section in requirement_sections:
                    section_text = section.get_text(strip=True)
                    if len(section_text) > 50:  # Only meaningful sections
                        requirements += section_text + "\n"

                # If no specific sections found, extract from description
                if not requirements and description:
                    # Look for bullet points or numbered lists
                    bullets = soup.find_all(['li', 'p'])
                    req_lines = []
                    for bullet in bullets:
                        text = bullet.get_text(strip=True)
                        if any(keyword in text.lower() for keyword in ['experience', 'skill', 'knowledge', 'ability', 'required', 'preferred']):
                            req_lines.append(text)

                    requirements = "\n".join(req_lines[:10])  # Limit to first 10 relevant lines

                return {
                    'description': description,
                    'requirements': requirements
                }

            except Exception as e:
                logger.warning(f"Attempt {attempt + 1} failed for {job_url}: {e}")
                if attempt < max_retries - 1:
                    time.sleep(random.uniform(2, 5))
                continue

        return {'description': '', 'requirements': ''}

    def enrich_jobs_with_details(self, max_jobs=50):
        """
        Enrich job listings with detailed information
        """
        logger.info("Enriching jobs with detailed information...")

        enriched_count = 0
        for job in self.jobs[:max_jobs]:
            if not job['description']:  # Only enrich if not already done
                logger.info(f"Enriching job: {job['title']} at {job['company']}")
                details = self.get_job_details(job['url'])
                job.update(details)
                enriched_count += 1

                # Rate limiting
                time.sleep(random.uniform(1, 3))

        logger.info(f"Enriched {enriched_count} jobs with detailed information")

    def filter_business_analyst_jobs(self):
        """
        Filter jobs to focus on Business Analyst positions
        """
        filtered_jobs = []

        for job in self.jobs:
            title_lower = job['title'].lower()
            desc_lower = job.get('description', '').lower()

            # Keywords for Business Analyst roles
            ba_keywords = [
                'business analyst', 'business analysis', 'data analyst', 'financial analyst',
                'systems analyst', 'process analyst', 'requirements analyst', 'bi analyst',
                'business intelligence', 'data analysis', 'analytics', 'reporting analyst'
            ]

            is_ba_job = any(keyword in title_lower for keyword in ba_keywords)

            # Also check description for context
            if not is_ba_job:
                is_ba_job = any(keyword in desc_lower for keyword in ba_keywords[:3])  # More restrictive for description

            if is_ba_job:
                filtered_jobs.append(job)

        logger.info(f"Filtered to {len(filtered_jobs)} Business Analyst jobs")
        self.jobs = filtered_jobs
        return filtered_jobs

    def save_to_json(self, filename="job_data.json"):
        """
        Save scraped jobs to JSON file
        """
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.jobs, f, indent=2, ensure_ascii=False)

        logger.info(f"Saved {len(self.jobs)} jobs to {filename}")

    def run_full_scrape(self, max_jobs=50):
        """
        Run complete scraping pipeline
        """
        logger.info("Starting full job scraping pipeline...")

        # Step 1: Search for jobs
        self.search_jobs(max_pages=10)

        # Step 2: Filter for Business Analyst roles
        self.filter_business_analyst_jobs()

        # Step 3: Enrich with detailed information
        self.enrich_jobs_with_details(max_jobs=max_jobs)

        # Step 4: Save results
        self.save_to_json()

        logger.info(f"Scraping complete! Collected {len(self.jobs)} Business Analyst jobs")
        return self.jobs

def main():
    scraper = SeekJobScraper()
    jobs = scraper.run_full_scrape(max_jobs=50)

    # Print summary
    print(f"\nScraping Summary:")
    print(f"Total jobs collected: {len(jobs)}")

    if jobs:
        print("\nSample jobs:")
        for i, job in enumerate(jobs[:3]):
            print(f"{i+1}. {job['title']} at {job['company']} - {job['location']}")

if __name__ == "__main__":
    main()