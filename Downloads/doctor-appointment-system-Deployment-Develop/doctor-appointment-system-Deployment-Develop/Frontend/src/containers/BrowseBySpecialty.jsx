import { Card, CardContent } from "@/components/ui/card";
import { motion, useAnimation } from "framer-motion";
import { Heart, Brain, SmileIcon as Tooth, Eye } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const MotionCard = motion(Card);
const MotionIcon = motion.div;

// Scroll animation hook
const useScrollAnimation = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return { ref, controls };
};

const SpecialtyCard = ({ icon: Icon, name, doctorCount, color, delay }) => {
  const { ref, controls } = useScrollAnimation();

  return (
    <MotionCard
      ref={ref}
      className="hover:shadow-lg transition-shadow"
      initial="hidden"
      animate={controls}
      whileHover={{ scale: 1.03 }}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: { 
            duration: 0.6, 
            delay 
          }
        }
      }}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-2">
          <MotionIcon
            className={`p-2 rounded-full ${color}`}
            initial={{ rotate: 0, scale: 0 }}
            animate={controls}
            variants={{
              hidden: { rotate: 0, scale: 0 },
              visible: { 
                rotate: 360, 
                scale: 1, 
                transition: { 
                  duration: 0.5, 
                  delay: delay + 0.2 
                }
              }
            }}
          >
            <Icon className="h-6 w-6" />
          </MotionIcon>
          <h3 className="font-semibold text-base">{name}</h3>
          <p className="text-sm text-muted-foreground">{doctorCount} doctors</p>
        </div>
      </CardContent>
    </MotionCard>
  );
};

export default function BrowseBySpecialty() {
  const { ref, controls } = useScrollAnimation();
  
  const specialties = [
    {
      icon: Heart,
      color: "bg-red-100 text-red-500",
      name: "Cardiology",
      doctorCount: 48,
    },
    {
      icon: Brain,
      color: "bg-pink-100 text-pink-500",
      name: "Neurology",
      doctorCount: 36,
    },
    {
      icon: Tooth,
      color: "bg-gray-100 text-gray-600",
      name: "Dentistry",
      doctorCount: 52,
    },
    {
      icon: Eye,
      color: "bg-blue-100 text-blue-500",
      name: "Ophthalmology",
      doctorCount: 29,
    },
  ];

  return (
    <section className="py-12 bg-gray-50 px-2 mx-6" id="specialties">
      <div className="container px-4 mx-auto">
        <motion.h2 
          ref={ref}
          className="text-3xl font-bold mb-8 text-center"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0, 
              transition: { duration: 0.5 }
            }
          }}
        >
          Browse by Speciality
        </motion.h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {specialties.map((specialty, index) => (
            <SpecialtyCard
              key={index}
              icon={specialty.icon}
              name={specialty.name}
              doctorCount={specialty.doctorCount}
              color={specialty.color}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}