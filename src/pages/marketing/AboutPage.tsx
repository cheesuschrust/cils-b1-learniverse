
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, Users, Target, Heart } from 'lucide-react';

const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: "Dr. Elena Rossi",
      role: "Italian Language Expert",
      bio: "Dr. Rossi has over 15 years of experience teaching Italian as a second language and specializes in CILS examination preparation.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    {
      name: "Marco Bianchi",
      role: "Educational Content Director",
      bio: "Marco has developed language learning curricula for major universities and brings his expertise to create our comprehensive CILS preparation materials.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    {
      name: "Sofia Esposito",
      role: "Community Manager",
      bio: "Sofia oversees our community of language learners, creating a supportive environment for citizenship applicants to connect and practice together.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    },
    {
      name: "Alessandro Conti",
      role: "Technology Director",
      bio: "Alessandro leads our technical team, creating innovative tools and applications to make learning Italian more effective and engaging.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
    }
  ];

  const values = [
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: "Accessibility",
      description: "We believe language learning should be accessible to everyone, regardless of background or resources."
    },
    {
      icon: <Target className="h-10 w-10 text-primary" />,
      title: "Effectiveness",
      description: "Our methods are based on educational research and proven to deliver results for citizenship applicants."
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Community",
      description: "We foster a supportive community where learners can connect, practice, and grow together."
    },
    {
      icon: <Heart className="h-10 w-10 text-primary" />,
      title: "Passion",
      description: "Our team is passionate about Italian language and culture, helping others achieve their citizenship dreams."
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us | CILS Italian Citizenship Test Preparation</title>
        <meta name="description" content="Learn about our mission to help citizenship applicants master Italian for their CILS B1 exam. Meet our team of language experts and educators." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Our Mission</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            We're dedicated to helping people achieve their dream of Italian citizenship by making language learning effective, accessible, and enjoyable.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1548&q=80" 
                alt="Our story" 
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-4">
                Our journey began when our founder, Elena Rossi, witnessed firsthand the struggles many citizenship applicants faced when preparing for their CILS language exam. Traditional resources were expensive, outdated, or ineffective for self-learners.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                In 2018, she assembled a team of language experts, educators, and technologists to create a better solution—a platform specifically designed for citizenship applicants that would make CILS preparation accessible to everyone.
              </p>
              <p className="text-lg text-gray-700">
                Today, we've helped thousands of applicants achieve their Italian citizenship dream through our innovative learning platform. We continue to evolve our methods and technology to provide the most effective preparation for the CILS B1 exam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="transition-all hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">{value.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 overflow-hidden rounded-full w-48 h-48 mx-auto">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Be part of our growing community of Italian language learners and citizenship applicants.
          </p>
          <Button variant="secondary" size="lg" asChild>
            <Link to="/auth/register">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
