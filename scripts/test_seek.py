#!/usr/bin/env python3
"""
Quick test for Seek.com.au scraping
"""

import requests
from bs4 import BeautifulSoup
import sys

def test_seek_connection():
    print("Testing Seek.com.au connection...")

    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })

    try:
        response = session.get('https://www.seek.com.au/business-analyst-jobs', timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')
        job_cards = soup.find_all('article', {'data-testid': 'job-card'})

        print(f'✓ Successfully connected! Found {len(job_cards)} job cards')

        if job_cards:
            first_job = job_cards[0]
            title_elem = first_job.find('a', {'data-testid': 'job-card-title'})
            if title_elem:
                print(f'✓ Sample job title: {title_elem.get_text(strip=True)}')

            company_elem = first_job.find('span', {'data-testid': 'job-card-company'})
            if company_elem:
                print(f'✓ Sample company: {company_elem.get_text(strip=True)}')

        return True

    except Exception as e:
        print(f'✗ Error: {e}')
        return False

if __name__ == "__main__":
    success = test_seek_connection()
    sys.exit(0 if success else 1)