import { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale-in';
  delay?: number;
}

const AnimatedSection = ({ 
  children, 
  className = '', 
  animation = 'fade-in',
  delay = 0 
}: AnimatedSectionProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  const getAnimationClass = () => {
    const baseClass = isVisible ? 'animate-' + animation : 'opacity-0';
    const delayClass = delay > 0 ? `animation-delay-${delay}` : '';
    
    switch (animation) {
      case 'slide-up':
        return isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8';
      case 'slide-left':
        return isVisible ? 'animate-fade-in' : 'opacity-0 translate-x-8';
      case 'slide-right':
        return isVisible ? 'animate-fade-in' : 'opacity-0 -translate-x-8';
      case 'scale-in':
        return isVisible ? 'animate-scale-in' : 'opacity-0 scale-95';
      default:
        return isVisible ? 'animate-fade-in' : 'opacity-0';
    }
  };

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 ease-out ${getAnimationClass()} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;