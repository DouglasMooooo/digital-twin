'use client';

import { Github, Linkedin, Mail, Phone, MapPin, Briefcase, GraduationCap, Code, Award, Bot, TrendingUp, Users, Zap } from 'lucide-react';
import digitalTwinData from '@/digitaltwin.json';

export default function PreviewPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Douglas Mo</h1>
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center animate-fade-in">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            {digitalTwinData.personal.name}
          </h2>
          <p className="text-2xl text-blue-600 mb-6">
            {digitalTwinData.personal.title}
          </p>
          <div className="flex justify-center items-center gap-6 text-gray-600 mb-8 flex-wrap">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{digitalTwinData.personal.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{digitalTwinData.personal.contact.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{digitalTwinData.personal.contact.email}</span>
            </div>
          </div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
            {digitalTwinData.personal.summary}
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <Briefcase className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">2+</p>
              <p className="text-gray-600">Years Experience</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <Code className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">5+</p>
              <p className="text-gray-600">AI Projects</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <GraduationCap className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">Master's</p>
              <p className="text-gray-600">Business Analytics</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">3</p>
              <p className="text-gray-600">Countries Worked</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Demo Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-xl p-8 text-white">
          <div className="text-center mb-8">
            <Bot className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-4">
              🤖 AI Digital Twin - Demo Mode
            </h3>
            <p className="text-blue-100 max-w-2xl mx-auto">
              这是静态预览版本。完成设置后，你将拥有一个智能AI助手，可以回答任何关于Douglas Mo的面试问题！
            </p>
          </div>
          
          {/* Demo Chat Interface */}
          <div className="bg-white rounded-lg p-6 max-w-3xl mx-auto">
            <div className="space-y-4">
              {/* Sample conversation */}
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                  <p className="text-sm text-gray-900">
                    你好！我是Douglas Mo的AI数字孪生。问我任何关于经验、技能、项目或面试场景的问题。
                    我针对5种面试场景进行了优化：电话筛选、HR面试、技术面试、管理层面试和高管面试！
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 justify-end">
                <div className="bg-blue-600 rounded-lg p-3 max-w-[70%]">
                  <p className="text-sm text-white">
                    Tell me about your transition from accounting to AI/tech
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                  <p className="text-sm text-gray-900">
                    My transition from accounting to AI/tech is a strategic evolution, not a departure. 
                    After 2+ years in international accounting at BF Suma Pharmaceuticals, I recognized 
                    that combining financial rigor with AI capabilities creates unique value. I pursued 
                    a Master's in Business Analytics at Victoria University and completed an intensive 
                    AI Builder Bootcamp, where I built production-grade RAG systems and deployed 5+ projects. 
                    This blend allows me to build AI solutions that solve real business problems with 
                    measurable ROI—like reducing inventory variance from 15% to &lt;3%, saving $50K annually.
                  </p>
                  <span className="text-xs text-gray-500 mt-1 block">
                    Context: hr
                  </span>
                </div>
              </div>
            </div>
            
            {/* Demo input (disabled) */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="完成设置后，在这里提问..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  disabled
                />
                <button
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg cursor-not-allowed"
                  disabled
                >
                  <Zap className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                💡 配置API密钥后即可启用实时AI对话
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Key Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <Code className="w-6 h-6 text-purple-600" />
              <h4 className="text-xl font-bold text-gray-900">AI Systems Development</h4>
            </div>
            <p className="text-gray-700">
              Built production-grade RAG systems with Upstash Vector, Groq API, and Next.js. 
              Deployed digital twin framework with 95%+ response accuracy and sub-2s latency.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h4 className="text-xl font-bold text-gray-900">Cross-Functional Expertise</h4>
            </div>
            <p className="text-gray-700">
              Unique blend of financial accounting rigor (2+ years international experience) 
              with modern AI/ML development skills. Bridge business impact and technical implementation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-6 h-6 text-blue-600" />
              <h4 className="text-xl font-bold text-gray-900">Measurable Impact</h4>
            </div>
            <p className="text-gray-700">
              Reduced inventory variance from 15% to &lt;3% at BF Suma, saving $50K annually. 
              Reduced monthly financial close from 15 to 7 days through process optimization.
            </p>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Experience</h3>
        <div className="space-y-6">
          {digitalTwinData.experience.slice(0, 3).map((exp, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{exp.title}</h4>
                  <p className="text-blue-600 font-semibold">{exp.company}</p>
                </div>
                <span className="text-gray-500 text-sm">{exp.duration}</span>
              </div>
              <p className="text-gray-700 mb-4">{exp.company_context}</p>
              {exp.achievements_star.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Key Achievement:</p>
                  <p className="text-sm text-gray-700">
                    <strong>Result:</strong> {exp.achievements_star[0].result}
                  </p>
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {exp.technical_skills_used.slice(0, 6).map((skill, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Technical Skills</h3>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Programming & AI/ML</h4>
              <div className="flex flex-wrap gap-2">
                {digitalTwinData.skills.technical.programming_languages.map((lang) => (
                  <span key={lang.language} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {lang.language} ({lang.proficiency})
                  </span>
                ))}
                {digitalTwinData.skills.technical.ai_ml.slice(0, 4).map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Tools & Platforms</h4>
              <div className="flex flex-wrap gap-2">
                {digitalTwinData.skills.technical.development_tools.map((tool, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {digitalTwinData.projects_portfolio.slice(0, 2).map((project, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h4 className="text-xl font-bold text-gray-900 mb-3">{project.name}</h4>
              <p className="text-gray-700 mb-4">{project.description}</p>
              <p className="text-sm text-green-700 font-semibold mb-4">
                📊 Impact: {project.impact}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, idx) => (
                  <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">
                    {tech}
                  </span>
                ))}
              </div>
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                >
                  <Github className="w-4 h-4" />
                  View on GitHub
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Setup Instructions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-600" />
            启动完整AI功能
          </h3>
          <p className="text-gray-700 mb-4">
            这是静态预览版本。要启用完整的AI聊天功能，请按照以下步骤操作：
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">
            <li>运行 <code className="bg-gray-200 px-2 py-1 rounded">npm install</code> 安装依赖</li>
            <li>从 Upstash 和 Groq 获取免费API密钥</li>
            <li>配置 <code className="bg-gray-200 px-2 py-1 rounded">.env</code> 文件</li>
            <li>运行 <code className="bg-gray-200 px-2 py-1 rounded">npm run setup-vector-db</code> 初始化数据库</li>
            <li>运行 <code className="bg-gray-200 px-2 py-1 rounded">npm run dev</code> 启动服务器</li>
          </ol>
          <p className="text-sm text-gray-600">
            📚 详细步骤请查看 <code className="bg-gray-200 px-2 py-1 rounded">QUICKSTART_CN.md</code>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 Douglas Mo. Built with Next.js, TypeScript, and AI. Powered by Upstash Vector and Groq API.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            This is a demonstration of RAG system implementation and digital twin concepts.
          </p>
        </div>
      </footer>
    </main>
  );
}
