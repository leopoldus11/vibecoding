
import React from 'react';
import { Calendar, Clock, Target, UserCheck } from 'lucide-react';

const CourseDetails: React.FC = () => {
  return (
    <section id="curriculum" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Intimate. Intense. Incredible.</h2>
          <p className="text-gray-500">Everything you need to build like a senior engineer in a fraction of the time.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              icon: <Calendar className="text-black" />, 
              label: "Bi-Weekly Sessions", 
              desc: "Two high-impact live workshops per week." 
            },
            { 
              icon: <Clock className="text-black" />, 
              label: "3 Hours Total", 
              desc: "Focused curriculum designed for busy professionals." 
            },
            { 
              icon: <UserCheck className="text-black" />, 
              label: "Capped at 6", 
              desc: "Small groups ensure direct feedback on your builds." 
            },
            { 
              icon: <Target className="text-black" />, 
              label: "Goal Oriented", 
              desc: "Walk away with a functional full-stack prototype." 
            }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-2xl border border-gray-100 hover:border-black transition-colors bg-white">
              <div className="mb-4">{item.icon}</div>
              <h3 className="font-bold mb-2">{item.label}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseDetails;
