"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-4xl p-6 lg:p-8">
        <Card className="p-6 border-border">
          <AboutContent />
        </Card>
      </div>
    </div>
  )
}

function AboutContent() {
  const [lang, setLang] = useState<"en" | "tr">("en")
  const [anim, setAnim] = useState<"shown" | "leaving" | "entering">("shown")
  const toggle = () => {
    setAnim("leaving")
    setTimeout(() => {
      setLang((l) => (l === "en" ? "tr" : "en"))
      setAnim("entering")
      setTimeout(() => setAnim("shown"), 20)
    }, 150)
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{lang === "en" ? "ReviewBoard" : "ReviewBoard"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {lang === "en" ? "A modern content review and management platform" : "Modern bir içerik değerlendirme ve yönetim platformu"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={toggle} className="ml-4">
          {lang === "en" ? "TR" : "EN"}
        </Button>
      </div>

      <div
        className={
          "transition-all duration-300 " +
          (anim === "shown"
            ? "opacity-100 translate-y-0"
            : anim === "leaving"
            ? "opacity-0 -translate-y-2"
            : "opacity-0 translate-y-2")
        }
      >
        {lang === "en" ? <EnglishBody /> : <TurkishBody />}
      </div>
    </div>
  )
}

function EnglishBody() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-2">Project Overview</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          ReviewBoard is a comprehensive content review and management platform built with modern web technologies.
          This project was designed as an interview case study to demonstrate full-stack web development capabilities.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Technical Architecture</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Frontend</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li><span className="font-medium text-foreground">Next.js 14</span> – App Router, SSR + CSR</li>
              <li><span className="font-medium text-foreground">TypeScript</span> – Type safety</li>
              <li><span className="font-medium text-foreground">Tailwind CSS</span> – Responsive UI</li>
              <li><span className="font-medium text-foreground">shadcn/ui</span> – Accessible components</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Backend & Database</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li><span className="font-medium text-foreground">Next.js API Routes</span> – RESTful endpoints</li>
              <li><span className="font-medium text-foreground">Prisma ORM</span> – Type-safe database access</li>
              <li><span className="font-medium text-foreground">PostgreSQL (Neon)</span> – Cloud, scalable</li>
              <li><span className="font-medium text-foreground">NextAuth.js</span> – OAuth 2.0 authentication</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Features</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">🔐 Authentication</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Google and GitHub OAuth</li>
                <li>JWT-based session management</li>
                <li>Secure and seamless UX</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">📋 Content Management</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>CRUD for items</li>
                <li>Advanced filtering and search</li>
                <li>Real-time status updates</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">🎯 Risk Assessment System</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Rule-based automatic risk scoring</li>
                <li>Customizable evaluation rules</li>
                <li>Transparent methodology</li>
              </ul>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">📜 Audit Trail</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Comprehensive audit logs</li>
                <li>Full change history</li>
                <li>Timestamped transactions</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">🎨 User Experience</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Dark/Light theme</li>
                <li>Responsive design</li>
                <li>Intuitive, modern interface</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3">Technical Challenges & Solutions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">1. Prisma Optimization in Serverless</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Implemented a global singleton pattern to reuse Prisma Client across requests and avoid connection overhead.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">2. Type-Safe API Responses</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Achieved end-to-end type safety leveraging Prisma-generated types across API and UI.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">3. Authentication State Management</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Stateless JWT-based sessions via NextAuth session strategy to sync server and client components.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3">Development Process</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>Git version control with meaningful commits</li>
          <li>TypeScript compile-time checks</li>
          <li>Secure env config management</li>
          <li>RESTful API design</li>
          <li>Database normalization and indexing</li>
          <li>Error handling and validation</li>
          <li>Responsive design principles</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3">Future Enhancements</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Dashboard analytics & visualizations</li>
            <li>Real-time notifications (WebSocket/SSE)</li>
            <li>Export/Import (CSV, Excel, PDF)</li>
            <li>Role-based authorization</li>
          </ul>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Elasticsearch for advanced search</li>
            <li>Progressive Web App (PWA) support</li>
            <li>Multi-language (i18n)</li>
            <li>Unit & integration tests</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-2">Contact</h2>
        <p className="text-sm text-muted-foreground">Feel free to reach out if you have any questions or feedback about this project.</p>
        <div className="mt-4 text-xs text-muted-foreground italic">
          This project is a case study developed to showcase modern full-stack web development capabilities.
        </div>
      </section>
    </div>
  )
}

function TurkishBody() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-2">Proje Genel Bakış</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          ReviewBoard, modern web teknolojileri kullanılarak geliştirilmiş kapsamlı bir içerik değerlendirme ve yönetim platformudur.
          Bu proje, full-stack web geliştirme yeteneklerini sergilemek amacıyla bir mülakat case study'si olarak tasarlanmıştır.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Teknik Mimari</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Frontend</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li><span className="font-medium text-foreground">Next.js 14</span> – App Router mimarisi, SSR + CSR</li>
              <li><span className="font-medium text-foreground">TypeScript</span> – Tip güvenliği</li>
              <li><span className="font-medium text-foreground">Tailwind CSS</span> – Responsive UI</li>
              <li><span className="font-medium text-foreground">shadcn/ui</span> – Erişilebilir bileşenler</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Backend & Database</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li><span className="font-medium text-foreground">Next.js API Routes</span> – RESTful endpoint'ler</li>
              <li><span className="font-medium text-foreground">Prisma ORM</span> – Tip güvenli veritabanı erişimi</li>
              <li><span className="font-medium text-foreground">PostgreSQL (Neon)</span> – Bulut, ölçeklenebilir</li>
              <li><span className="font-medium text-foreground">NextAuth.js</span> – OAuth 2.0 kimlik doğrulama</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Özellikler</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">🔐 Kimlik Doğrulama</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Google ve GitHub OAuth entegrasyonu</li>
                <li>JWT tabanlı session yönetimi</li>
                <li>Güvenli ve sorunsuz kullanıcı deneyimi</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">📋 İçerik Yönetimi</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>CRUD operasyonları ile tam özellikli item yönetimi</li>
                <li>Gelişmiş filtreleme ve arama özellikleri</li>
                <li>Gerçek zamanlı durum güncellemeleri</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">🎯 Risk Değerlendirme Sistemi</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Kural tabanlı otomatik risk skorlama</li>
                <li>Özelleştirilebilir değerlendirme kuralları</li>
                <li>Şeffaf hesaplama metodolojisi</li>
              </ul>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">📜 Denetim İzleme</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Kapsamlı audit log sistemi</li>
                <li>Tüm değişikliklerin izlenebilirliği</li>
                <li>Zaman damgalı işlem geçmişi</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">🎨 Kullanıcı Deneyimi</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Karanlık/Aydınlık tema desteği</li>
                <li>Responsive tasarım</li>
                <li>Sezgisel ve modern arayüz</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3">Teknik Zorluklar & Çözümler</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">1. Serverless Ortamda Prisma Optimizasyonu</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Global singleton pattern ile aynı Prisma instance'ı istekler arasında paylaşıldı.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">2. Type-Safe API Responses</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Prisma'nın ürettiği tipler ile uçtan uca tip güvenliği sağlandı.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">3. Authentication State Management</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              NextAuth session strategy ile JWT tabanlı stateless kimlik doğrulama uygulandı.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3">Geliştirme Süreci</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          <li>Git version control ve anlamlı commit mesajları</li>
          <li>TypeScript ile derleme anında tip kontrolü</li>
          <li>Environment variables ile güvenli yapılandırma</li>
          <li>RESTful API tasarım prensipleri</li>
          <li>Veritabanı normalizasyonu ve indeksleme</li>
          <li>Hata yönetimi ve doğrulama</li>
          <li>Duyarlı (responsive) tasarım prensipleri</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-3">Gelecek Geliştirmeler</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Dashboard analitiği ve görselleştirmeler</li>
            <li>Gerçek zamanlı bildirimler (WebSocket/SSE)</li>
            <li>Export/Import (CSV, Excel, PDF)</li>
            <li>Rol tabanlı yetkilendirme</li>
          </ul>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Gelişmiş arama için Elasticsearch</li>
            <li>Progressive Web App (PWA) desteği</li>
            <li>Çoklu dil (i18n)</li>
            <li>Birim ve entegrasyon testleri</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-foreground mb-2">İletişim</h2>
        <p className="text-sm text-muted-foreground">Bu proje hakkında sorularınız veya geri bildirimleriniz için benimle iletişime geçebilirsiniz.</p>
        <div className="mt-4 text-xs text-muted-foreground italic">
          Bu proje, modern full-stack web development yeteneklerini sergilemek için geliştirilmiş bir case study'dir.
        </div>
      </section>
    </div>
  )
}


