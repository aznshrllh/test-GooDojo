import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Users,
  Award,
  BarChart3,
  LineChart,
  Building,
  Briefcase,
  Shield,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              <Shield className="mr-1 h-3 w-3" />
              Enterprise HR Solutions
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Transform Your HR Management with GooDojo
            </h1>
            <p className="text-xl text-muted-foreground">
              Streamline your HR operations, boost employee engagement, and make
              data-driven decisions with our comprehensive HR management
              platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Book a Demo
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square md:aspect-auto md:h-[500px] rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-2 shadow-xl">
              <div className="h-full w-full rounded-xl bg-background/80 backdrop-blur-md p-6 overflow-hidden">
                <div className="h-full w-full bg-card rounded-lg shadow-sm border flex items-center justify-center">
                  <Image
                    src="/islamic-pattern9.png"
                    alt="GooDojo HR Dashboard"
                    width={600}
                    height={400}
                    className="rounded-lg object-cover"
                    priority
                  />
                  {/* If image is not available, use a fallback */}
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                    <div className="text-center p-8">
                      <Users className="h-16 w-16 text-primary/40 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-primary/60">
                        GooDojo HR Dashboard
                      </h3>
                      <p className="text-muted-foreground mt-2">
                        Comprehensive HR management interface
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-primary/30 blur-xl" />
            <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-secondary/20 blur-xl" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">
              Comprehensive HR Management Tools
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              GooDojo HR provides everything you need to manage your workforce
              effectively, from employee records to performance reviews.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Employee Management",
                description:
                  "Maintain detailed employee profiles, track history, and manage documents seamlessly.",
                link: "/employees",
              },
              {
                icon: BarChart3,
                title: "Performance Tracking",
                description:
                  "Set KPIs, conduct reviews, and visualize performance trends across your organization.",
                link: "/performances",
              },
              {
                icon: Building,
                title: "Department Structure",
                description:
                  "Organize your company structure and visualize reporting relationships easily.",
                link: "/departments",
              },
              {
                icon: Award,
                title: "Skills & Competencies",
                description:
                  "Track employee skills, certifications, and identify skill gaps in your organization.",
                link: "/skills",
              },
              {
                icon: Briefcase,
                title: "Job Position Management",
                description:
                  "Define roles, responsibilities, and create clear career advancement paths.",
                link: "/job-positions",
              },
              {
                icon: LineChart,
                title: "Talent Pools",
                description:
                  "Group high-potential employees and plan succession for key positions.",
                link: "/talent-pools",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-card border rounded-xl p-6 transition-all hover:shadow-md hover:border-primary/20"
              >
                <div className="absolute top-4 right-4 bg-primary/10 p-2 rounded-full">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
                <p className="text-muted-foreground mt-2">
                  {feature.description}
                </p>
                <Link
                  href={feature.link}
                  className="mt-4 inline-flex items-center text-sm text-primary font-medium hover:underline"
                >
                  Learn more
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials/Stats Section */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">
              Trusted by HR Professionals
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Join hundreds of companies that use GooDojo HR to streamline their
              human resources operations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { value: "98%", label: "Customer satisfaction rate" },
              { value: "45%", label: "Reduction in HR administrative tasks" },
              { value: "3.5x", label: "Faster performance review cycles" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-background border rounded-xl p-8 text-center"
              >
                <div className="text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-card border rounded-xl p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="flex mb-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <svg
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                </div>
                <blockquote className="text-lg italic mb-4">
                  &quot;GooDojo HR has transformed how we manage employee data
                  and performance reviews. The platform is intuitive and has
                  saved our HR team countless hours each month.&quot;
                </blockquote>
                <div>
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-sm text-muted-foreground">
                    HR Director, TechCorp Inc.
                  </div>
                </div>
              </div>
              <div className="md:border-l md:pl-8">
                <h3 className="text-xl font-semibold mb-4">
                  Ready to transform your HR operations?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start using GooDojo HR today and see the difference it can
                  make for your organization.
                </p>
                <Link href="/dashboard">
                  <Button>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="font-bold text-xl mb-4 flex items-center">
                <div className="h-8 w-8 rounded-md bg-primary mr-2 flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">GD</span>
                </div>
                GooDojo HR
              </div>
              <p className="text-sm text-muted-foreground">
                Comprehensive HR management solutions for modern businesses.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/features"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/integrations"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    href="/changelog"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/blog"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/documentation"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    HR Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="/webinars"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Webinars
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Legal
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} GooDojo HR. All rights reserved.
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
