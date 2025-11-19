'use client';

import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  ChevronDown,
  Award,
  TrendingUp,
  BookOpen,
  MessageSquare,
  GraduationCap,
} from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import digitalTwinData from '@/digitaltwin.json';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'stats', 'experience', 'skills', 'projects', 'education', 'interview'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (showChat) {
    return (
      <div>
        <ChatInterface />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Douglas Mo</h1>
          <div className="hidden md:flex gap-6 items-center">
            <button
              onClick={() => scrollToSection('home')}
              className={`transition-colors ${
                activeSection === 'home' ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('experience')}
              className={`transition-colors ${
                activeSection === 'experience' ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Experience
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className={`transition-colors ${
                activeSection === 'skills' ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Skills
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className={`transition-colors ${
                activeSection === 'projects' ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setShowChat(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </button>
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 space-y-3">
            <button
              onClick={() => scrollToSection('home')}
              className="block w-full text-left text-gray-600 hover:text-blue-600 py-2"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('experience')}
              className="block w-full text-left text-gray-600 hover:text-blue-600 py-2"
            >
              Experience
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className="block w-full text-left text-gray-600 hover:text-blue-600 py-2"
            >
              Skills
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="block w-full text-left text-gray-600 hover:text-blue-600 py-2"
            >
              Projects
            </button>
            <button
              onClick={() => setShowChat(true)}
              className="block w-full text-left text-blue-600 font-bold py-2"
            >
              Chat
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold mb-4">{digitalTwinData.personal.title}</h2>
          <p className="text-xl text-blue-100 mb-8">{digitalTwinData.personal.elevator_pitch}</p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowChat(true)}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors"
            >
              Ask Me Anything
            </button>
            <a
              href="#experience"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              Learn More
              <ChevronDown className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-center mb-16 text-gray-900">At a Glance</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <TrendingUp className="w-12 h-12 text-blue-600 mb-4" />
              <p className="text-4xl font-bold text-gray-900 mb-2">{digitalTwinData.experience.length}+</p>
              <p className="text-gray-700 font-medium">Years Experience</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <Award className="w-12 h-12 text-purple-600 mb-4" />
              <p className="text-4xl font-bold text-gray-900 mb-2">{digitalTwinData.projects_portfolio.length}</p>
              <p className="text-gray-700 font-medium">Projects Completed</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <GraduationCap className="w-12 h-12 text-green-600 mb-4" />
              <p className="text-4xl font-bold text-gray-900 mb-2">Master&apos;s</p>
              <p className="text-gray-700 font-medium">Business Analytics</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <Award className="w-12 h-12 text-orange-600 mb-4" />
              <p className="text-4xl font-bold text-gray-900 mb-2">4</p>
              <p className="text-gray-700 font-medium">Countries Worked</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border-2 border-blue-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">My Unique Value</h4>
              <div className="space-y-3 text-gray-700">
                {digitalTwinData.unique_value_propositions.map((uvp, index) => (
                  <p key={index} className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">→</span>
                    <span>{uvp.replace(/^\*\*|\*\*$/g, '').replace(/\*\*/g, '')}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-center mb-16 text-gray-900">Professional Experience</h3>
          <div className="space-y-8">
            {digitalTwinData.experience.map((exp, index) => (
              <div key={index} className="bg-white border-2 border-blue-200 rounded-2xl p-8 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">{exp.title}</h4>
                    <p className="text-lg text-blue-600 font-semibold">{exp.company}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">{exp.duration}</span>
                </div>
                <p className="text-gray-700 mb-6">{exp.company_context}</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-bold text-gray-900 mb-2">Key Achievements (STAR)</h5>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {exp.achievements_star.map((achievement, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-green-600 font-bold">✓</span>
                          <span>{achievement.result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 mb-2">Technical Skills Used</h5>
                    <div className="flex flex-wrap gap-2">
                      {exp.technical_skills_used.map((skill, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-center mb-16 text-gray-900">Technical Skills</h3>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 mb-6">Programming Languages</h4>
              <div className="space-y-4">
                {digitalTwinData.skills.technical.programming_languages.map((lang, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-bold text-gray-900">{lang.language}</h5>
                      <span className="text-sm font-semibold text-blue-600">{lang.proficiency}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{lang.years_experience}+ years</p>
                    <p className="text-sm text-gray-700">{lang.frameworks.join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-gray-900 mb-6">Other Expertise</h4>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h5 className="font-bold text-gray-900 mb-2">AI/ML</h5>
                  <div className="flex flex-wrap gap-2">
                    {digitalTwinData.skills.technical.ai_ml.map((skill, idx) => (
                      <span key={idx} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h5 className="font-bold text-gray-900 mb-2">Databases</h5>
                  <div className="flex flex-wrap gap-2">
                    {digitalTwinData.skills.technical.databases.map((db, idx) => (
                      <span key={idx} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs">
                        {db}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h5 className="font-bold text-gray-900 mb-2">Cloud Platforms</h5>
                  <div className="flex flex-wrap gap-2">
                    {digitalTwinData.skills.technical.cloud_platforms.map((platform, idx) => (
                      <span key={idx} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-center mb-16 text-gray-900">Featured Projects</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {digitalTwinData.projects_portfolio.map((project, index) => (
              <div key={index} className="bg-white border-2 border-purple-200 rounded-2xl p-8 hover:shadow-xl transition-shadow">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h4>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Technologies</h5>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 font-semibold text-sm mb-4">Impact: {project.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-center mb-16 text-gray-900">Education</h3>
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 border-2 border-green-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">{digitalTwinData.education.current.degree}</h4>
              <p className="text-lg text-green-600 font-semibold mb-2">{digitalTwinData.education.current.university}</p>
              <p className="text-gray-600 mb-4">Expected Graduation: {digitalTwinData.education.current.expected_graduation}</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-bold text-gray-900 mb-2">Key Projects</h5>
                {digitalTwinData.education.current.key_projects && digitalTwinData.education.current.key_projects.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {digitalTwinData.education.current.key_projects.map((project, idx) => (
                      <li key={idx}>{project}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No key projects listed</p>
                )}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border-2 border-blue-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">{digitalTwinData.education.undergraduate.degree}</h4>
              <p className="text-lg text-blue-600 font-semibold mb-2">{digitalTwinData.education.undergraduate.university}</p>
              <p className="text-gray-600">Graduated: {digitalTwinData.education.undergraduate.graduation_year}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interview Prep Section */}
      <section id="interview" className="py-20 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-center mb-16 text-gray-900">Interview Ready</h3>
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-12 rounded-2xl text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4" />
            <h4 className="text-2xl font-bold mb-4">Behavioral & Technical Questions</h4>
            <p className="text-lg mb-8">I'm prepared with STAR-formatted answers to common interview questions across various domains.</p>
            <button
              onClick={() => setShowChat(true)}
              className="px-8 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Ask Interview Questions
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h5 className="font-bold text-lg mb-4">About</h5>
              <p className="text-gray-300 text-sm">Business Analyst | AI Product Manager | Accounting Executive</p>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#experience" className="text-gray-300 hover:text-white">Experience</a></li>
                <li><a href="#skills" className="text-gray-300 hover:text-white">Skills</a></li>
                <li><a href="#projects" className="text-gray-300 hover:text-white">Projects</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-4">Connect</h5>
              <div className="flex gap-4">
                <a href={digitalTwinData.personal.contact.github} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                  <Github className="w-5 h-5" />
                </a>
                <a href={digitalTwinData.personal.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href={`mailto:${digitalTwinData.personal.contact.email}`} className="text-gray-300 hover:text-white">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Douglas Mo. All rights reserved. | AI Digital Twin Portfolio</p>
          </div>
        </div>
      </footer>
    </div>
  );
}