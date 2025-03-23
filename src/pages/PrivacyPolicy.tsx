
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Lock, Eye, Server, User, Book } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="container max-w-4xl py-8 px-4 mx-auto">
      <Helmet>
        <title>Privacy Policy | CILS B2 Cittadinanza</title>
      </Helmet>
      
      <Link to="/" className="flex items-center gap-1 text-muted-foreground mb-6 hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </Link>
      
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Privacy Policy</CardTitle>
          </div>
          <CardDescription>
            Last updated: {new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                Introduction
              </h2>
              <p className="text-muted-foreground mb-2">
                Welcome to CILS B2 Cittadinanza. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>
              <p className="text-muted-foreground">
                This privacy policy aims to give you information on how we collect and process your personal data through your use of this website, including any data you may provide when you sign up for an account, purchase a subscription, or use our learning features.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                The Data We Collect About You
              </h2>
              <p className="text-muted-foreground mb-2">
                Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data).
              </p>
              <p className="text-muted-foreground mb-2">
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>Identity Data includes first name, last name, username, or similar identifier.</li>
                <li>Contact Data includes email address and telephone numbers.</li>
                <li>Technical Data includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                <li>Profile Data includes your username and password, your interests, preferences, feedback, and survey responses.</li>
                <li>Usage Data includes information about how you use our website, products, and services.</li>
                <li>Learning Data includes your progress, scores, and activity within the learning tools.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                How We Use Your Personal Data
              </h2>
              <p className="text-muted-foreground mb-2">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal obligation.</li>
                <li>To provide you with a personalized learning experience.</li>
                <li>To improve our platform and services based on your usage and feedback.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                Data Storage and Security
              </h2>
              <p className="text-muted-foreground mb-2">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
              </p>
              <p className="text-muted-foreground">
                We have put in place procedures to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Your Legal Rights
              </h2>
              <p className="text-muted-foreground mb-2">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data. These include the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>Request access to your personal data.</li>
                <li>Request correction of your personal data.</li>
                <li>Request erasure of your personal data.</li>
                <li>Object to processing of your personal data.</li>
                <li>Request restriction of processing your personal data.</li>
                <li>Request transfer of your personal data.</li>
                <li>Right to withdraw consent.</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                You will not have to pay a fee to access your personal data (or to exercise any of the other rights). However, we may charge a reasonable fee if your request is clearly unfounded, repetitive, or excessive. Alternatively, we could refuse to comply with your request in these circumstances.
              </p>
            </section>
            
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-2">Contact Us</h3>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this privacy policy or our privacy practices, please contact us at:
                <br />
                <a href="mailto:privacy@cilsb2cittadinanza.com" className="text-primary hover:underline">privacy@cilsb2cittadinanza.com</a>
              </p>
              
              <Button asChild>
                <Link to="/">Return to Homepage</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
