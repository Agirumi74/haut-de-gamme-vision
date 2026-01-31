import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Process from "@/components/Process";
import Gallery from "@/components/Gallery";
import Formations from "@/components/Formations";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import ScrollToTop from "@/components/ScrollToTop";
import AnimatedSection from "@/components/AnimatedSection";


const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <AnimatedSection animation="fade-in">
        <Services />
      </AnimatedSection>
      <AnimatedSection animation="slide-up" delay={100}>
        <About />
      </AnimatedSection>
      <AnimatedSection animation="fade-in" delay={200}>
        <Process />
      </AnimatedSection>
      <AnimatedSection animation="slide-left" delay={100}>
        <Gallery />
      </AnimatedSection>
      <AnimatedSection animation="scale-in">
        <Formations />
      </AnimatedSection>
      <AnimatedSection animation="slide-right" delay={150}>
        <Team />
      </AnimatedSection>
      <AnimatedSection animation="fade-in" delay={100}>
        <Testimonials />
      </AnimatedSection>
      <AnimatedSection animation="slide-up" delay={200}>
        <FAQ />
      </AnimatedSection>
      <AnimatedSection animation="scale-in" delay={100}>
        <Newsletter />
      </AnimatedSection>
      <AnimatedSection animation="fade-in">
        <Contact />
      </AnimatedSection>
      <Footer />
      <FloatingCTA />
      <ScrollToTop />
      
    </div>
  );
};

export default Index;
