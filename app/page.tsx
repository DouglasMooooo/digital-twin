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
          <p className="text-gray-600 text-lg mb-4">Hi, I'm</p>
          <h2 className="text-6xl md:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Douglas Mo
            </span>
          </h2>
          <p className="text-2xl md:text-3xl text-gray-700 font-semibold mb-6">
            {digitalTwinData.personal.title}
          </p>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            {digitalTwinData.personal.summary}
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-6 text-gray-600 mb-10">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>{digitalTwinData.personal.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>{digitalTwinData.personal.contact.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>{digitalTwinData.personal.contact.email}</span>
            </div>
          </div>

          <a 
            href="#ai-chat" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            Chat with My AI Twin
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            About <span className="text-blue-600">Me</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <Briefcase className="w-12 h-12 text-blue-600 mb-4" />
              <p className="text-4xl font-bold text-gray-900 mb-2">2+</p>
              <p className="text-gray-700 font-medium">Years Experience</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <Code className="w-12 h-12 text-purple-600 mb-4" />
              <p className="text-4xl font-bold text-gray-900 mb-2">5+</p>
              <p className="text-gray-700 font-medium">AI Projects Deployed</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <GraduationCap className="w-12 h-12 text-green-600 mb-4" />
              <p className="text-4xl font-bold text-gray-900 mb-2">Master's</p>
              <p className="text-gray-700 font-medium">Business Analytics</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <Award className="w-12 h-12 text-orange-600 mb-4" />
              <p className="text-4xl font-bold text-gray-900 mb-2">3</p>
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
          <h3 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            Work <span className="text-blue-600">Experience</span>
          </h3>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            My professional journey across international accounting, AI development, and data analytics
          </p>
          
          <div className="space-y-8">
            {digitalTwinData.experience.map((exp, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-blue-600">
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">{exp.title}</h4>
                      <div className="flex items-center gap-2 text-blue-600 font-semibold mb-2">
                        <Building2 className="w-5 h-5" />
                        <span>{exp.company}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{exp.company_context}</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 mt-2 md:mt-0">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">{exp.duration}</span>
                    </div>
                  </div>
                  
                  {/* Key Achievement */}
                  {exp.achievements_star.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-6 border border-blue-200">
                      <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-600" />
                        Key Achievement
                      </h5>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p><strong className="text-blue-600">Situation:</strong> {exp.achievements_star[0].situation}</p>
                        <p><strong className="text-purple-600">Task:</strong> {exp.achievements_star[0].task}</p>
                        <p><strong className="text-green-600">Action:</strong> {exp.achievements_star[0].action}</p>
                        <p><strong className="text-orange-600">Result:</strong> {exp.achievements_star[0].result}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Technical Skills Used */}
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-3">Technologies & Tools:</h5>
                    <div className="flex flex-wrap gap-2">
                      {exp.technical_skills_used.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Leadership */}
                  {exp.leadership_examples && exp.leadership_examples.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">Leadership:</h5>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {exp.leadership_examples.map((example, idx) => (
                          <li key={idx}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            Technical <span className="text-blue-600">Skills</span>
          </h3>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            A comprehensive toolkit spanning AI/ML, data analytics, and software development
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Programming Languages */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-md">
              <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Code className="w-6 h-6 text-blue-600" />
                Programming Languages
              </h4>
              <div className="space-y-4">
                {digitalTwinData.skills.technical.programming_languages.map((lang) => (
                  <div key={lang.language} className="bg-white p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-900">{lang.language}</span>
                      <span className="text-sm font-semibold text-blue-600">{lang.proficiency}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{lang.years_experience} years experience</div>
                    <div className="flex flex-wrap gap-2">
                      {lang.frameworks.map((fw, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {fw}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI/ML Skills */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-md">
              <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                AI & Machine Learning
              </h4>
              <div className="space-y-2">
                {digitalTwinData.skills.technical.ai_ml.map((skill, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Databases */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Databases</h4>
              <div className="space-y-2">
                {digitalTwinData.skills.technical.databases.map((db, index) => (
                  <div key={index} className="bg-white p-2 rounded-lg text-sm text-gray-700">
                    {db}
                  </div>
                ))}
              </div>
            </div>

            {/* Cloud & DevOps */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Cloud & DevOps</h4>
              <div className="space-y-2">
                {digitalTwinData.skills.technical.cloud_platforms.map((cloud, index) => (
                  <div key={index} className="bg-white p-2 rounded-lg text-sm text-gray-700">
                    {cloud}
                  </div>
                ))}
              </div>
            </div>

            {/* Development Tools */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl shadow-md">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Development Tools</h4>
              <div className="space-y-2">
                {digitalTwinData.skills.technical.development_tools.slice(0, 6).map((tool, index) => (
                  <div key={index} className="bg-white p-2 rounded-lg text-sm text-gray-700">
                    {tool}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Soft Skills */}
          <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-2xl">
            <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">Soft Skills</h4>
            <div className="flex flex-wrap justify-center gap-3">
              {digitalTwinData.skills.soft_skills.map((skill, index) => (
                <span key={index} className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            <span className="text-blue-600">Education</span>
          </h3>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Academic foundation in business analytics and financial accounting
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Current Education */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-t-4 border-blue-600">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="w-8 h-8 text-blue-600" />
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    In Progress
                  </span>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                  {digitalTwinData.education.current.degree}
                </h4>
                <p className="text-blue-600 font-semibold mb-2">{digitalTwinData.education.current.university}</p>
                <p className="text-gray-600 text-sm mb-4">
                  {digitalTwinData.education.current.location} • {digitalTwinData.education.current.duration}
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  <strong>Expected Graduation:</strong> {digitalTwinData.education.current.expected_graduation}
                </p>
                
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Relevant Coursework:</h5>
                  <div className="flex flex-wrap gap-2">
                    {digitalTwinData.education.current.relevant_coursework.map((course, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-900 mb-2">Key Projects:</h5>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {digitalTwinData.education.current.key_projects.map((project, idx) => (
                      <li key={idx}>{project}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Undergraduate Education */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-t-4 border-green-600">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="w-8 h-8 text-green-600" />
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    Completed
                  </span>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                  {digitalTwinData.education.undergraduate.degree}
                </h4>
                <p className="text-green-600 font-semibold mb-2">{digitalTwinData.education.undergraduate.university}</p>
                <p className="text-gray-600 text-sm mb-4">
                  {digitalTwinData.education.undergraduate.location} • {digitalTwinData.education.undergraduate.duration}
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  <strong>Graduated:</strong> {digitalTwinData.education.undergraduate.graduation_year}
                </p>
                
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Relevant Coursework:</h5>
                  <div className="flex flex-wrap gap-2">
                    {digitalTwinData.education.undergraduate.relevant_coursework.map((course, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    {digitalTwinData.education.undergraduate.foundation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Tools Section */}
      <section id="tools" className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              🛠️ Connect with <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My AI Twin</span>
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Three powerful ways to interact with my professional profile and AI assistant
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* VS Code Extension */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-t-4 border-blue-600">
              <div className="text-5xl mb-4">💻</div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">VS Code Extension</h4>
              <p className="text-gray-600 mb-6 min-h-[60px]">
                Access my professional data directly in your editor with the <code className="bg-gray-100 px-2 py-1 rounded">@douglas</code> chat participant
              </p>
              <div className="space-y-3 mb-6 bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-900">Features:</p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span> /experience - Work history
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span> /skills - Technical stack
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span> /projects - Portfolio
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span> /interview - Interview prep
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <a 
                  href="https://github.com/DouglasMooooo/digital-twin/raw/main/vscode-extension/douglas-digital-twin-copilot-1.0.0.vsix" 
                  className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg text-center font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                >
                  📦 Download .vsix
                </a>
                <a 
                  href="https://github.com/DouglasMooooo/digital-twin/tree/main/vscode-extension"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full border-2 border-blue-600 text-blue-600 px-4 py-3 rounded-lg text-center font-semibold hover:bg-blue-50 transition-all"
                >
                  📚 Setup Guide
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                For developers using VS Code
              </p>
            </div>

            {/* ChatGPT GPT */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-t-4 border-green-600">
              <div className="text-5xl mb-4">🤖</div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">ChatGPT GPT</h4>
              <p className="text-gray-600 mb-6 min-h-[60px]">
                Chat with my AI digital twin powered by RAG and OpenAI models - no installation needed
              </p>
              <div className="space-y-3 mb-6 bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-900">Features:</p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> AI-powered responses
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> Interview preparation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> Project deep dives
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> Real-time feedback
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <a 
                  href="https://chatgpt.com/g/g-6904ec1206488191959573c3c4822b4e-douglas-mo-ai-digital" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg text-center font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
                >
                  🚀 Open GPT
                </a>
                <CopyLinkButton
                  url="https://chatgpt.com/g/g-6904ec1206488191959573c3c4822b4e-douglas-mo-ai-digital"
                  className="block w-full border-2 border-green-600 text-green-600 px-4 py-3 rounded-lg text-center font-semibold hover:bg-green-50 transition-all"
                >
                  📋 Copy Link
                </CopyLinkButton>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Perfect for recruiters & interviewers
              </p>
            </div>

            {/* Local Chat */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-t-4 border-purple-600">
              <div className="text-5xl mb-4">💬</div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">Local RAG Chat</h4>
              <p className="text-gray-600 mb-6 min-h-[60px]">
                Chat with RAG-powered responses without leaving this page - instant and private
              </p>
              <div className="space-y-3 mb-6 bg-purple-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-900">Features:</p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600">✓</span> Vector search
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600">✓</span> Quick responses
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600">✓</span> Context-aware AI
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600">✓</span> No signup needed
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <a 
                  href="#ai-chat"
                  className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3 rounded-lg text-center font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg"
                >
                  💭 Start Chat
                </a>
                <a 
                  href="https://github.com/DouglasMooooo/digital-twin#readme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full border-2 border-purple-600 text-purple-600 px-4 py-3 rounded-lg text-center font-semibold hover:bg-purple-50 transition-all"
                >
                  📖 Learn More
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Try it now - scroll down ↓
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md">
              <p className="text-3xl font-bold text-blue-600 mb-2">3</p>
              <p className="text-gray-700 font-medium">Integration Options</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md">
              <p className="text-3xl font-bold text-green-600 mb-2">24/7</p>
              <p className="text-gray-700 font-medium">AI Availability</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md">
              <p className="text-3xl font-bold text-purple-600 mb-2">RAG</p>
              <p className="text-gray-700 font-medium">Powered Accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Interface Section */}
      <section id="ai-chat" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              🤖 Ask My <span className="text-blue-600">AI Digital Twin</span> Anything
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powered by RAG (Retrieval-Augmented Generation) and optimized for interview scenarios.
              Ask about my experience, skills, projects, or how I'd handle specific interview questions.
            </p>
          </div>
          <ChatInterface />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Douglas Mo
              </h3>
              <p className="text-gray-400">Business Analytics Graduate | AI Systems Developer</p>
            </div>
            
            <div className="flex gap-6">
              <a href={digitalTwinData.personal.contact.github} target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href={digitalTwinData.personal.contact.linkedin} target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href={`mailto:${digitalTwinData.personal.contact.email}`}
                 className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Douglas Mo. Built with Next.js, TypeScript, and AI.</p>
            <p className="mt-2">Powered by Upstash Vector and Groq API • RAG System Implementation</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
