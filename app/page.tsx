"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Shield, Database, Code, Mail, Github, Linkedin, ExternalLink, Download, Server, Terminal, Eye, Lock, Zap, Activity, Calendar, MapPin, Building, Moon, Sun, ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react'

// Terminal typing animation hook
function useTerminalTyping(text: string, speed: number = 50) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  return { displayText, showCursor, isComplete: currentIndex >= text.length }
}

// Dark mode context
function useDarkMode() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return { isDark, setIsDark }
}

// Terminal Window Component
function TerminalWindow({ children, title = "terminal" }: { children: React.ReactNode, title?: string }) {
  return (
    <div className="bg-gray-900 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-700 px-4 py-2 border-b border-gray-700">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-gray-400 text-sm font-mono">{title}</div>
        <div className="w-12"></div>
      </div>
      <div className="p-4 font-mono text-sm">
        {children}
      </div>
    </div>
  )
}

// Command Line Navigation
function CommandNav({ activeSection, onSectionChange }: { activeSection: string, onSectionChange: (section: string) => void }) {
  const sections = [
    { id: 'overview', command: 'whoami', label: 'Overview' },
    { id: 'skills', command: 'ls skills/', label: 'Skills' },
    { id: 'projects', command: 'cat projects/', label: 'Projects' },
    { id: 'experience', command: 'history', label: 'Experience' },
    { id: 'contact', command: 'ping contact', label: 'Contact' }
  ]

  return (
    <div className="hidden md:flex space-x-6">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`font-mono text-sm transition-colors ${
            activeSection === section.id 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          $ {section.command}
        </button>
      ))}
    </div>
  )
}

export default function TerminalExecutivePortfolio() {
  const { isDark, setIsDark } = useDarkMode()
  const [activeSection, setActiveSection] = useState('overview')
  
  const whoamiText = useTerminalTyping("BRANDON JOHNSON\nCyber Range Developer // Red + Blue Team Training", 30)
  const promptText = useTerminalTyping("Ready to build secure digital environments...", 40)
  const resumeRef = useRef<HTMLAnchorElement>(null);
  const handleResumeDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    resumeRef.current?.click();
  };

  // ===== Contact form state (controlled inputs) =====
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email,   setEmail]     = useState<string>('');
  const [subject, setSubject]   = useState<string>('');
  const [message, setMessage]   = useState<string>('');

  // Submission status for success/error feedback
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // We will submit to Formspree via fetch, without using React's onSubmit prop.
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const handleSubmit = async (e: Event) => {
      e.preventDefault();
      if (!form) return;

      setSubmitStatus('submitting');

      try {
        const res = await fetch(form.action, {
          method: form.method,
          body: new FormData(form),
          headers: {
            Accept: 'application/json',
          },
        });

        if (res.ok) {
          // Clear inputs after successful submission
          setFirstName('');
          setLastName('');
          setEmail('');
          setSubject('');
          setMessage('');
          setSubmitStatus('success');
        } else {
          setSubmitStatus('error');
        }
      } catch {
        setSubmitStatus('error');
      }
    };

    form.addEventListener('submit', handleSubmit);
    return () => {
      form.removeEventListener('submit', handleSubmit);
    };
  }, []);

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'skills', 'projects', 'experience', 'contact']
      const scrollPosition = window.scrollY + 100

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  const skills = {
    infrastructure: [
      { name: "Docker", icon: Database, command: "docker --version" },
      { name: "Wazuh", icon: Shield, command: "wazuh-control status" },
      { name: "AWS", icon: Server, command: "aws configure list" },
      { name: "Ubuntu Server", icon: Terminal, command: "uname -a" }
    ],
    redteam: [
      { name: "Kali Linux", icon: Terminal, command: "kali --version" },
      { name: "Metasploit", icon: Zap, command: "msfconsole -v" },
      { name: "Nmap", icon: Activity, command: "nmap --version" },
      { name: "Burp Suite", icon: Eye, command: "burpsuite --version" }
    ],
    blueteam: [
      { name: "Suricata", icon: Shield, command: "suricata --version" },
      { name: "ELK Stack", icon: Database, command: "elasticsearch --version" },
      { name: "Velociraptor", icon: Activity, command: "velociraptor version" },
      { name: "T-Pot", icon: Lock, command: "tpot status" }
    ],
    development: [
      { name: "React", icon: Code, command: "react --version" },
      { name: "Node.js", icon: Server, command: "node --version" },
      { name: "Python", icon: Code, command: "python --version" },
      { name: "TypeScript", icon: Code, command: "tsc --version" }
    ]
  }

  const projects = [
    {
      title: "soc_simulation_platform",
      description: "Comprehensive security operations center training environment with real-time threat simulation and incident response scenarios.",
      stack: ["React", "Node.js", "Docker", "ELK Stack"],
      status: "production",
      command: "./deploy_soc_sim.sh"
    },
    {
      title: "redteam_lab_curriculum",
      description: "Complete educational framework for offensive security training, including hands-on labs and assessment modules.",
      stack: ["Kali Linux", "Metasploit", "Python", "VMware"],
      status: "active",
      command: "./setup_redteam_lab.py"
    },
    {
      title: "nice_framework_quiz",
      description: "Interactive assessment tool aligned with NIST NICE Framework competencies for cybersecurity workforce development.",
      stack: ["React", "TypeScript", "Chakra UI", "Firebase"],
      status: "beta",
      command: "npm run build:quiz"
    },
    {
      title: "forensics_vm_suite",
      description: "Pre-configured virtual machine collection for digital forensics training with realistic case scenarios.",
      stack: ["VMware", "Ubuntu", "Autopsy", "Volatility"],
      status: "released",
      command: "vagrant up forensics-lab"
    }
  ]

  const experiences = [
    {
      title: "IT Administrator",
      company: "Systems Products & Solutions, Inc.",
      location: "Huntsville, AL",
      period: "Jun 2022 – Jan 2023",
      timestamp: "[2022-06-01 08:00:00]",
      description: "Deployed Office 365 to 150+ users and implemented secure data backups. Interfaced with Army Futures and AMC to ensure synchronization.",
      achievements: [
        "Deployed Office 365 to 150+ users and implemented secure data backups.",
        "Interfaced with Army Futures and AMC to ensure synchronization."
      ]
    },
    {
      title: "Network Support Technician LvL II",
      company: "Huntsville Hospital",
      location: "Huntsville, AL",
      period: "Jun 2023 – Present",
      timestamp: "[2023-06-01 09:00:00]",
      description: "Diagnosed and resolved IT support issues for 100+ thin clients via VMware. Automated tasks with batch files and implemented BitLocker encryption. Managed secure systems in the hospital data center.",
      achievements: [
        "Diagnosed and resolved IT support issues for 100+ thin clients via VMware.",
        "Automated tasks with batch files and implemented BitLocker encryption.",
        "Managed secure systems in the hospital data center."
      ]
    },
    {
      title: "Junior Cyber Associate",
      company: "H2L Solutions, Inc.",
      location: "Huntsville, AL",
      period: "Mar 2024 – Jun 2024",
      timestamp: "[2024-03-01 08:30:00]",
      description: "Studied CMMC, ICS/FRCS security, and RMF Authorization to Operate. Supported critical cybersecurity framework processes.",
      achievements: [
        "Studied CMMC, ICS/FRCS security, and RMF Authorization to Operate.",
        "Supported critical cybersecurity framework processes."
      ]
    },
    {
      title: "Cyber Range Developer",
      company: "ASCTE",
      location: "Huntsville, AL",
      period: "2024 – Present",
      timestamp: "[2024-01-01 10:00:00]",
      description: "Built hands-on red/blue team labs with Kali and Purple Team tooling. Developed simulation-based content with ELK and SIEM tools.",
      achievements: [
        "Built hands-on red/blue team labs with Kali and Purple Team tooling.",
        "Developed simulation-based content with ELK and SIEM tools."
      ]
    }
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="font-mono text-lg text-gray-900 dark:text-white">
              <span className="text-green-500">brandon@cyberrange</span>
              <span className="text-gray-500">:~$</span>
            </div>
            
            <CommandNav activeSection={activeSection} onSectionChange={scrollToSection} />
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4 text-gray-500" />
                <Switch checked={isDark} onCheckedChange={setIsDark} />
                <Moon className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Overview Section */}
      <section id="overview" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Professional Portfolio
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                Cybersecurity and IT professional with a strong focus on designing and developing 
                advanced cyber range environments and comprehensive training curricula. With over four years of experience 
                spanning cybersecurity, IT administration, and network support. I create immersive, scenario-driven learning
                experiences that connect theory to real-world application. My work integrates live virtual labs, custom-built
                simulations, and NICE Framework-aligned modules to equip learners with practical skills in areas such as incident
                response, penetration testing, digital forensics, and vulnerability analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700"
                onClick={() => scrollToSection('contact')}
                type="button">
                  <Mail className="w-4 h-4 mr-2" />
                  Get In Touch
                </Button>

                {/* Hidden anchor for resume download */}
                <a
                  href="/resume.pdf"
                  download
                  ref={resumeRef}
                  style={{ display: 'none' }}
                  aria-hidden="true"
                  tabIndex={-1}
                />
                  
                <Button size="lg" variant="outline" onClick={handleResumeDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
              </div>
            </div>
            
            <div>
              <TerminalWindow title="whoami">
                <div className="text-green-400">
                  <div className="mb-2">
                    <span className="text-blue-400">brandon@cyberrange</span>
                    <span className="text-white">:~$ </span>
                    <span className="text-green-400">whoami</span>
                  </div>
                  <div className="text-white whitespace-pre-line mb-4">
                    {whoamiText.displayText}
                    {whoamiText.showCursor && !whoamiText.isComplete && <span className="bg-green-400 text-black">█</span>}
                  </div>
                  {whoamiText.isComplete && (
                    <div className="mt-4">
                      <div className="mb-2">
                        <span className="text-blue-400">brandon@cyberrange</span>
                        <span className="text-white">:~$ </span>
                        <span className="text-green-400">echo $STATUS</span>
                      </div>
                      <div className="text-white">
                        {promptText.displayText}
                        {promptText.showCursor && <span className="bg-green-400 text-black">█</span>}
                      </div>
                    </div>
                  )}
                </div>
              </TerminalWindow>
            </div>
          </div>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto" />

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="font-mono text-green-500">$ </span>ls skills/
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive technical expertise across infrastructure, offensive security, 
              defensive operations, and modern development practices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(skills).map(([category, skillList]) => (
              <Card key={category} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-gray-900 dark:text-white font-mono">
                    ./{category}/
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {skillList.map((skill, index) => (
                      <div key={index} className="group">
                        <div className="flex items-center space-x-3 mb-1">
                          <skill.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{skill.name}</span>
                        </div>
                        <div className="text-xs font-mono text-gray-500 dark:text-gray-400 ml-7 opacity-0 group-hover:opacity-100 transition-opacity">
                          $ {skill.command}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto" />

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="font-mono text-green-500">$ </span>cat projects/
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Innovative solutions in cybersecurity training, simulation platforms, 
              and educational technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl text-gray-900 dark:text-white font-mono">
                      <ChevronRight className="w-4 h-4 inline mr-1 text-green-500" />
                      {project.title}
                    </CardTitle>
                    <Badge 
                      variant={project.status === 'production' ? 'default' : 'secondary'}
                      className={`font-mono text-xs ${
                        project.status === 'production' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        project.status === 'active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        project.status === 'beta' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.stack.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs font-mono">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded p-2 mb-4">
                    <code className="text-xs text-gray-700 dark:text-gray-300 font-mono">
                      $ {project.command}
                    </code>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Project
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto" />

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="font-mono text-green-500">$ </span>history
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Progressive career in cybersecurity with focus on education, 
              training development, and hands-on security operations.
            </p>
          </div>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <Card key={index} className="border-0 shadow-sm bg-white dark:bg-gray-800">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="font-mono text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {exp.timestamp}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {exp.title}
                      </h3>
                      <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium mb-2">
                        <Building className="w-4 h-4 mr-2" />
                        {exp.company}
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm space-x-4 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {exp.period}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {exp.location}
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        {exp.description}
                      </p>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center font-mono">
                          <Terminal className="w-4 h-4 mr-2" />
                          ./achievements.log
                        </h4>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, achIndex) => (
                            <li key={achIndex} className="flex items-start">
                              <span className="text-green-500 mr-3 font-mono">{'>'}</span>
                              <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto" />

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="font-mono text-green-500">$ </span>ping contact
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Interested in collaboration, consulting, or discussing cybersecurity training initiatives? 
              Let's establish a connection.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <TerminalWindow title="message_console">
              <div className="text-green-400 mb-4">
                <span className="text-blue-400">branjohnson331@gmail.com</span>
                <span className="text-white">:~$ </span>
                <span className="text-green-400">./send_message.sh</span>
              </div>

              {/* Success / Error messages */}
              <div aria-live="polite" className="mb-4">
                {submitStatus === 'success' && (
                  <div className="flex items-start gap-2 rounded border border-green-700/40 bg-green-900/30 p-3 text-green-200">
                    <CheckCircle2 className="h-4 w-4 mt-0.5" />
                    <div>
                      <div className="font-semibold">Message dispatched</div>
                      <div>Your message was sent successfully. I’ll get back to you soon.</div>
                    </div>
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="flex items-start gap-2 rounded border border-yellow-700/40 bg-yellow-900/30 p-3 text-yellow-200">
                    <AlertTriangle className="h-4 w-4 mt-0.5" />
                    <div>
                      <div className="font-semibold">Submission failed</div>
                      <div>Something went wrong sending your message. Please try again or email me directly.</div>
                    </div>
                  </div>
                )}
              </div>

              {/* NOTE: No onSubmit prop per instructions. We use native event via useEffect. */}
              <form
                ref={formRef}
                className="space-y-4"
                action="https://formspree.io/f/mgvzrwqy"
                method="POST"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-green-400 text-sm font-mono mb-1">
                      --first-name
                    </label>
                    <Input 
                      name="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John" 
                      className="bg-gray-800 border-gray-600 text-white font-mono text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-green-400 text-sm font-mono mb-1">
                      --last-name
                    </label>
                    <Input 
                      name="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe" 
                      className="bg-gray-800 border-gray-600 text-white font-mono text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-green-400 text-sm font-mono mb-1">
                    --email
                  </label>
                  <Input 
                    name="email"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@company.com" 
                    className="bg-gray-800 border-gray-600 text-white font-mono text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-green-400 text-sm font-mono mb-1">
                    --subject
                  </label>
                  <Input 
                    name="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Cyber Range Consultation" 
                    className="bg-gray-800 border-gray-600 text-white font-mono text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-green-400 text-sm font-mono mb-1">
                    --message
                  </label>
                  <Textarea 
                    name="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about your project or training needs..."
                    className="bg-gray-800 border-gray-600 text-white font-mono text-sm min-h-[100px]"
                    required
                  />
                </div>

                {/* Optional honeypot field to reduce spam */}
                <input type="text" name="_gotcha" className="hidden" aria-hidden="true" />

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 font-mono disabled:opacity-70"
                  disabled={submitStatus === 'submitting'}
                >
                  {submitStatus === 'submitting' ? '$ ./execute --sending...' : '$ ./execute --send'}
                </Button>
              </form>
            </TerminalWindow>

            <div className="space-y-8">
              <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 dark:text-white font-mono">
                    ./connect --professional
                  </CardTitle>
                  <CardDescription className="dark:text-gray-300">
                    Professional networks and code repositories
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <a 
                    href="https://linkedin.com/in/brandon-johnson-a32ab0224/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">LinkedIn</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                        /in/brandon-johnson
                      </div>
                    </div>
                  </a>
                  <a 
                    href="https://github.com/bjohnsonascte" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <Github className="w-5 h-5 text-gray-700 dark:text-gray-300 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">GitHub</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                        /bjohnsonascte
                      </div>
                    </div>
                  </a>
                  <a 
                    href="mailto:branjohnson331@gmail.com" 
                    className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Email</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                        branjohnson331@gmail.com
                      </div>
                    </div>
                  </a>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-blue-50 dark:bg-blue-900/20">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Terminal className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 font-mono">
                      ./services --available
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Cybersecurity training development, cyber range consulting, 
                      and educational partnerships available.
                    </p>
                    <Button variant="outline" size="sm" className="font-mono">
                      $ man services
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 dark:text-gray-400 text-sm font-mono">
              <span className="text-green-500">brandon@cyberrange</span>
              <span>:~$ </span>
              <span>© 2024 All rights reserved.</span>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="https://linkedin.com/in/brandon-johnson-a32ab0224/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://github.com/bjohnsonascte" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="mailto:branjohnson331@gmail.com" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
