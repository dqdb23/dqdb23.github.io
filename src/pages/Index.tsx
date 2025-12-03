import { useState, useMemo } from 'react';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import { Header } from '@/components/Header';
import { PostCard } from '@/components/PostCard';
import { PostDetail } from '@/components/PostDetail';
import { ArchiveList } from '@/components/ArchiveList';
import { AboutPage } from '@/components/AboutPage';
import { Footer } from '@/components/Footer';

interface Post {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    title: 'APT32 malware analysis',
    date: '2025-12-03',
    excerpt: 'I. Over view | File name | Welcome to the Darkness.html | | --- | --- | | sha256 | 56e926b816c062078f8acac3bd28e2759447d07d9fb6e1d31d2a032121c110c6 | | File Size | 5.01 MB (5256901 bytes) | ...',
    content: `# APT32 Malware Analysis

## I. Overview

| Property | Value |
|----------|-------|
| File name | Welcome to the Darkness.html |
| sha256 | 56e926b816c062078f8acac3bd28e2759447d07d9fb6e1d31d2a032121c110c6 |
| File Size | 5.01 MB (5256901 bytes) |

## II. Technical Analysis

The malware employs sophisticated obfuscation techniques to evade detection. Initial analysis reveals a multi-stage payload delivery mechanism.

### Stage 1: Initial Loader
The HTML file contains embedded JavaScript that decodes a base64-encoded payload.

### Stage 2: Persistence
After execution, the malware establishes persistence through scheduled tasks.

## III. IOCs

- **C2 Server**: 192.168.1.100:443
- **File Hash**: 56e926b816c062078f8acac3bd28e2759447d07d9fb6e1d31d2a032121c110c6
- **Registry Key**: HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run

## IV. Recommendations

1. Block identified IOCs at network perimeter
2. Update antivirus signatures
3. Monitor for suspicious scheduled task creation
4. Implement application whitelisting`,
  },
  {
    id: '2',
    title: 'Ransomware Reverse Engineering Deep Dive',
    date: '2025-11-28',
    excerpt: 'A comprehensive analysis of modern ransomware encryption techniques and decryption possibilities...',
    content: `# Ransomware Reverse Engineering

## Executive Summary

This report details the reverse engineering process of a recently discovered ransomware sample affecting enterprise networks.

## Technical Analysis

### Encryption Algorithm
The ransomware uses AES-256-CBC for file encryption with RSA-2048 for key wrapping.

### File Targeting
Extensions targeted include: .docx, .xlsx, .pdf, .pptx, .jpg, .png

## Decryption Analysis

After extensive analysis, no cryptographic weaknesses were identified in the implementation.

## Prevention Recommendations

- Regular offline backups
- Network segmentation
- Email filtering
- User awareness training`,
  },
  {
    id: '3',
    title: 'YARA Rules for Emotet Detection',
    date: '2025-11-20',
    excerpt: 'Custom YARA rules developed for detecting Emotet malware variants in enterprise environments...',
    content: `# YARA Rules for Emotet Detection

## Introduction

Emotet continues to evolve with new evasion techniques. This article presents updated YARA rules.

## Rule Development

\`\`\`yara
rule Emotet_Loader_2025 {
    meta:
        description = "Detects Emotet loader variants"
        author = "\\Some"
        date = "2025-11-20"
    strings:
        $s1 = { 48 8B C4 48 89 58 08 }
        $s2 = "RunDLL32"
    condition:
        uint16(0) == 0x5A4D and all of ($s*)
}
\`\`\`

## Testing Results

- True Positive Rate: 98.5%
- False Positive Rate: 0.02%`,
  },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return SAMPLE_POSTS;
    const query = searchQuery.toLowerCase();
    return SAMPLE_POSTS.filter(
      post => 
        post.title.toLowerCase().includes(query) || 
        post.excerpt.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleReadMore = (post: Post) => {
    setSelectedPost(post);
    setActiveTab('detail');
  };

  const handleBack = () => {
    setSelectedPost(null);
    setActiveTab('home');
  };

  const handleArchiveSelect = (post: Post) => {
    setSelectedPost(post);
    setActiveTab('detail');
  };

  const renderContent = () => {
    if (activeTab === 'detail' && selectedPost) {
      return <PostDetail post={selectedPost} onBack={handleBack} />;
    }

    switch (activeTab) {
      case 'home':
        return (
          <div>
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <PostCard key={post.id} post={post} onReadMore={handleReadMore} />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-10">No posts found...</p>
            )}
          </div>
        );
      case 'archive':
        return <ArchiveList posts={SAMPLE_POSTS} onSelectPost={handleArchiveSelect} />;
      case 'about':
        return <AboutPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Interactive Particle Background */}
      <ParticleCanvas />
      
      {/* Main Content */}
      <div className="content-container">
        <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
          <Header 
            activeTab={activeTab === 'detail' ? 'home' : activeTab}
            onTabChange={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <main>
            {renderContent()}
          </main>

          <Footer />
        </div>
      </div>

      {/* Side decorations */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 text-muted-foreground/30 text-xs font-mono z-20">
        <span className="writing-vertical">MALWARE_ANALYSIS</span>
        <span className="writing-vertical">THREAT_HUNTING</span>
        <span className="writing-vertical">CYBER_SECURITY</span>
      </div>
      
      <div className="fixed right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 text-muted-foreground/30 text-xs font-mono z-20">
        <span className="writing-vertical">REVERSE_ENG</span>
        <span className="writing-vertical">APT_TRACKING</span>
        <span className="writing-vertical">IOC_RESEARCH</span>
      </div>

      {/* Instruction hint */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-muted-foreground/50 text-xs font-mono z-20 pointer-events-none">
        Click & drag anywhere to create particles ✨
      </div>
    </div>
  );
};

export default Index;
