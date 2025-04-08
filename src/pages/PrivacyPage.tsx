
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';

const PrivacyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | CILS B1 Italian Citizenship Test Prep</title>
        <meta name="description" content="Our privacy policy explains how we collect, use, and protect your personal information." />
      </Helmet>

      <div className="container mx-auto max-w-4xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              <p className="text-muted-foreground mb-4">
                Last Updated: April 8, 2025
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">1. Introduction</h2>
              <p>
                Welcome to the CILS B1 Italian Citizenship Test Prep platform. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">2. Data We Collect</h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                <li><strong>Profile Data:</strong> includes your username and password, purchases or orders made by you, your interests, preferences, feedback, and survey responses.</li>
                <li><strong>Usage Data:</strong> includes information about how you use our website, products, and services.</li>
                <li><strong>Learning Data:</strong> includes your progress, test results, practice activities, and other educational data generated during your use of our platform.</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">3. How We Use Your Data</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>To register you as a new customer.</li>
                <li>To process and deliver your order including managing payments, fees, and charges.</li>
                <li>To manage our relationship with you, including notifying you about changes to our terms or privacy policy.</li>
                <li>To personalize your learning experience and provide content tailored to your needs.</li>
                <li>To administer and protect our business and this website.</li>
                <li>To deliver relevant website content and advertisements to you and measure or understand the effectiveness of the advertising we serve to you.</li>
                <li>To use data analytics to improve our website, products/services, marketing, customer relationships, and experiences.</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">5. Data Retention</h2>
              <p>
                We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">6. Your Legal Rights</h2>
              <p>
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>Request access to your personal data.</li>
                <li>Request correction of your personal data.</li>
                <li>Request erasure of your personal data.</li>
                <li>Object to processing of your personal data.</li>
                <li>Request restriction of processing your personal data.</li>
                <li>Request transfer of your personal data.</li>
                <li>Right to withdraw consent.</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">7. Children's Privacy</h2>
              <p>
                Our service is not directed to children under the age of 16. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">8. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">9. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> privacy@cilsb1prep.com<br />
                <strong>Address:</strong> 123 Learning Lane, Education City, 12345
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PrivacyPage;
