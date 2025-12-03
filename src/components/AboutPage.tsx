import { Shield, Code, Target, Mail, Github, Twitter } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="animate-fade-in">
      <div className="glass-card p-8 mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          About Me
        </h2>
        
        <p className="text-secondary-foreground leading-relaxed mb-6">
          Hello! I'm a passionate <span className="text-primary font-medium">Malware Analyst</span> and{' '}
          <span className="text-primary font-medium">Cyber Threat Hunter</span> with years of experience in 
          dissecting malicious software and protecting digital infrastructure.
        </p>

        <p className="text-secondary-foreground leading-relaxed mb-6">
          My work involves reverse engineering malware samples, analyzing attack patterns, and developing 
          detection signatures to protect organizations from emerging threats.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-5 h-5 text-cyber-cyan" />
            <h3 className="text-lg font-semibold text-foreground">Skills</h3>
          </div>
          <ul className="space-y-2 text-secondary-foreground">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Reverse Engineering
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Malware Analysis
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyber-green" />
              Threat Intelligence
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyber-purple" />
              Incident Response
            </li>
          </ul>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Focus Areas</h3>
          </div>
          <ul className="space-y-2 text-secondary-foreground">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              APT Analysis
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Ransomware Research
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyber-green" />
              YARA Rule Development
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyber-purple" />
              Sandbox Analysis
            </li>
          </ul>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Connect</h3>
        <div className="flex gap-4">
          <a 
            href="#" 
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-secondary-foreground hover:bg-primary/20 hover:text-primary transition-all duration-300"
          >
            <Mail className="w-4 h-4" />
            Email
          </a>
          <a 
            href="#" 
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-secondary-foreground hover:bg-primary/20 hover:text-primary transition-all duration-300"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <a 
            href="#" 
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-secondary-foreground hover:bg-primary/20 hover:text-primary transition-all duration-300"
          >
            <Twitter className="w-4 h-4" />
            Twitter
          </a>
        </div>
      </div>
    </div>
  );
};
