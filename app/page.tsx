/* eslint-disable jsx-a11y/no-static-element-interactions */
import ChatInterface from '@/components/ChatInterface';
import CopyLinkButton from '@/components/CopyLinkButton';
import { Github, Linkedin, Mail, Phone, MapPin, Briefcase, GraduationCap, Code, Award, Calendar, Building2, Sparkles } from 'lucide-react';
import digitalTwinData from '@/digitaltwin.json';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Navigation */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Douglas Mo
            </h1>
            <div className="hidden md:flex gap-8 text-sm font-medium">
              <a href="#home" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#experience" className="text-gray-600 hover:text-blue-600 transition-colors">Experience</a>
              <a href="#skills" className="text-gray-600 hover:text-blue-600 transition-colors">Skills</a>
              <a href="#education" className="text-gray-600 hover:text-blue-600 transition-colors">Education</a>
              <a href="#tools" className="text-gray-600 hover:text-blue-600 transition-colors font-semibold">🛠️ Tools</a>
              <a href="#ai-chat" className="text-gray-600 hover:text-blue-600 transition-colors">AI Chat</a>
            </div>
            <div className="flex gap-4">
              <a href={digitalTwinData.personal.contact.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href={digitalTwinData.personal.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href={`mailto:${digitalTwinData.personal.contact.email}`} className="text-gray-600 hover:text-blue-600 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center animate-fade-in">
          <p className="text-gray-600 text-lg mb-4">Hi, I&apos;m</p>
          <h2 className="text-6xl md:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Douglas Mo
            </span>
          </h2>
          <p className="text-2xl md:text-3xl text-gray-700 font-semibold mb-6">
            {digitalTwinData.personal.title}
          </p>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">{digitalTwinData.personal.summary}</p>
          
          <div className="flex flex-wrap justify-center items-center gap-6 text-gray-600 mb-10">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>{digitalTwinData.personal.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>{digitalTwinData.personal.contact.phone || 'Available'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 hover:text-blue-800"><a href={`mailto:${digitalTwinData.personal.contact.email}`}>{digitalTwinData.personal.contact.email}</a></span>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <a href={digitalTwinData.personal.contact.github} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2">
              <Github className="w-5 h-5" />
              GitHub
            </a>
            <a href={digitalTwinData.personal.contact.linkedin} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2">
              <Linkedin className="w-5 h-5" />
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">About Me</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg text-center">
              <Briefcase className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">4</h3>
              <p className="text-gray-600 font-medium">Countries Worked</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg text-center">
              <Calendar className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{digitalTwinData.experience.length}+</h3>
              <p className="text-gray-600 font-medium">Years Experience</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg text-center">
              <Code className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{digitalTwinData.projects_portfolio.length}</h3>
              <p className="text-gray-600 font-medium">Projects Completed</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-lg text-center">
              <Award className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">100%</h3>
              <p className="text-gray-600 font-medium">Commitment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Professional Experience</h2>
          <div className="space-y-8">
            {digitalTwinData.experience.map((exp, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-8 border-l-4 border-blue-600">
                <div className="flex items-start justify-between mb-4 flex-wrap">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{exp.title}</h3>
                    <p className="text-lg text-blue-600 font-semibold flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      {exp.company}
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold flex items-center gap-2 mt-4 md:mt-0">
                    <Award className="w-4 h-4" />
                    {exp.duration}
                  </span>
                </div>

                <p className="text-gray-700 mb-6">{exp.company_context}</p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      Key Achievements
                    </h4>
                    <ul className="space-y-2">
                      {exp.achievements_star.map((achievement, idx) => (
                        <li key={idx} className="text-gray-700 flex gap-2">
                          <span className="text-green-500 font-bold mt-1">✓</span>
                          <span>{achievement.result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Code className="w-5 h-5 text-purple-500" />
                      Technical Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.technical_skills_used.map((skill, idx) => (
                        <span key={idx} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {exp.leadership_examples && exp.leadership_examples.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Leadership Examples</h4>
                    <ul className="space-y-1 text-gray-700">
                      {exp.leadership_examples.map((example, idx) => (
                        <li key={idx} className="text-sm">• {example}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Technical Skills</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Programming Languages</h3>
              <div className="space-y-4">
                {digitalTwinData.skills.technical.programming_languages.map((lang, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-gray-900">{lang.language}</h4>
                      <span className="text-sm font-semibold text-blue-700">{lang.proficiency}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{lang.years_experience}+ years experience</p>
                    <p className="text-sm text-gray-700">{lang.frameworks.join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Other Expertise</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-3">AI/ML</h4>
                  <div className="flex flex-wrap gap-2">
                    {digitalTwinData.skills.technical.ai_ml.map((skill, idx) => (
                      <span key={idx} className="bg-purple-200 text-purple-900 px-3 py-1 rounded-full text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-3">Databases</h4>
                  <div className="flex flex-wrap gap-2">
                    {digitalTwinData.skills.technical.databases.map((db, idx) => (
                      <span key={idx} className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-xs font-semibold">
                        {db}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-3">Cloud Platforms</h4>
                  <div className="flex flex-wrap gap-2">
                    {digitalTwinData.skills.technical.cloud_platforms.map((platform, idx) => (
                      <span key={idx} className="bg-orange-200 text-orange-900 px-3 py-1 rounded-full text-xs font-semibold">
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
      <section id="projects" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {digitalTwinData.projects_portfolio.map((project, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{project.name}</h3>
                <p className="text-gray-700 mb-4">{project.description}</p>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, tidx) => (
                      <span key={tidx} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-medium">💡 Impact: {project.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Education</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-8 border-l-4 border-green-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{digitalTwinData.education.current.degree}</h3>
              <p className="text-lg text-green-700 font-semibold mb-2">
                <GraduationCap className="inline w-5 h-5 mr-2" />
                {digitalTwinData.education.current.university}
              </p>
              <p className="text-gray-600 text-sm mb-4">Expected Graduation: {digitalTwinData.education.current.expected_graduation}</p>
              <div className="bg-white p-4 rounded-lg">
                <h5 className="font-semibold text-gray-900 mb-2">Relevant Coursework&colon;</h5>
                <div className="flex flex-wrap gap-2">
                  {digitalTwinData.education.current.relevant_coursework.map((course, idx) => (
                    <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{digitalTwinData.education.undergraduate.degree}</h3>
              <p className="text-lg text-blue-700 font-semibold mb-2">
                <GraduationCap className="inline w-5 h-5 mr-2" />
                {digitalTwinData.education.undergraduate.university}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                {digitalTwinData.education.undergraduate.location} • {digitalTwinData.education.undergraduate.duration}
              </p>
              <p className="text-sm text-gray-700 mb-4">
                <strong>Graduated&colon;</strong> {digitalTwinData.education.undergraduate.graduation_year}
              </p>
              
              <div className="mb-4">
                <h5 className="font-semibold text-gray-900 mb-2">Relevant Coursework&colon;</h5>
                <div className="flex flex-wrap gap-2">
                  {digitalTwinData.education.undergraduate.relevant_coursework.map((course, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Foundation&colon;</strong> {digitalTwinData.education.undergraduate.foundation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">🛠️ Tools & Resources</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">GPT Assistant</h3>
              <p className="text-gray-700 mb-6">I&apos;ve created a custom GPT that helps with interview preparation, career advice, and Q&A about my experience.</p>
              <div className="flex gap-3">
                <a href="https://chatgpt.com/g/g-6904ec1206488191959573c3c4822b4e-douglas-mo-ai-digital" target="_blank" rel="noopener noreferrer" className="block flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg text-center font-semibold hover:bg-blue-700 transition-all">
                  🚀 Open GPT
                </a>
                <CopyLinkButton
                  url="https://chatgpt.com/g/g-6904ec1206488191959573c3c4822b4e-douglas-mo-ai-digital"
                  className="block flex-1 border-2 border-green-600 text-green-600 px-4 py-3 rounded-lg text-center font-semibold hover:bg-green-50 transition-all"
                >
                  📋 Copy Link
                </CopyLinkButton>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                This GPT has access to my complete professional profile and can answer questions about my experience, skills, and background.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Interactive Chat</h3>
              <p className="text-gray-700 mb-6">Chat directly with my AI Digital Twin. Ask about my projects, experience, or any questions!</p>
              <a href="#ai-chat" className="block w-full bg-purple-600 text-white px-4 py-3 rounded-lg text-center font-semibold hover:bg-purple-700 transition-all">
                💬 Start Chat
              </a>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Uses vector search and RAG to provide context-aware responses about my background.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Section */}
      <section id="ai-chat" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">💬 AI Digital Twin Chat</h2>
          <ChatInterface />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold mb-4">About</h4>
              <p className="text-gray-400">{digitalTwinData.personal.title}</p>
              <p className="text-gray-400 text-sm mt-2">{digitalTwinData.personal.location}</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#experience" className="hover:text-white transition-colors">Experience</a></li>
                <li><a href="#skills" className="hover:text-white transition-colors">Skills</a></li>
                <li><a href="#projects" className="hover:text-white transition-colors">Projects</a></li>
                <li><a href="#education" className="hover:text-white transition-colors">Education</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href={digitalTwinData.personal.contact.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-6 h-6" />
                </a>
                <a href={digitalTwinData.personal.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href={`mailto:${digitalTwinData.personal.contact.email}`} className="text-gray-400 hover:text-white transition-colors">
                  <Mail className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Douglas Mo. All rights reserved. | AI Digital Twin Portfolio</p>
          </div>
        </div>
      </footer>
    </main>
  );
}