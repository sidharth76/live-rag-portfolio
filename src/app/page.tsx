import { Hero } from '@/components/Hero';
import { Experience } from '@/components/Experience';
import { Skills } from '@/components/Skills';
import { Projects } from '@/components/Projects';
import { InteractiveRAGDemo } from '@/components/InteractiveRAGDemo';
import { Education } from '@/components/Education';
import { Contact } from '@/components/Contact';

export default function Home() {
  return (
    <div className="space-y-4">
      <Hero />
      <Experience />
      <Skills />
      <Projects />
      <InteractiveRAGDemo />
      <Education />
      <Contact />
    </div>
  );
}
