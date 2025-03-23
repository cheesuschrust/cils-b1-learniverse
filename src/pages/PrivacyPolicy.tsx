
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const PrivacyPolicy = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Privacy Policy</CardTitle>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p>Welcome to CILS B2 Cittadinanza Question of the Day ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-xl font-semibold mb-2">2. Data We Collect</h2>
            <p>We may collect, use, store, and transfer different kinds of personal data about you:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data</strong> includes email address.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
              <li><strong>Usage Data</strong> includes information about how you use our website, products, and services, including learning progress, quiz results, and interaction with educational content.</li>
              <li><strong>Communications Data</strong> includes your preferences in receiving communications from us.</li>
            </ul>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-xl font-semibold mb-2">3. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>To register you as a new user</li>
              <li>To provide and personalize our services</li>
              <li>To manage our relationship with you</li>
              <li>To improve our website, products/services, and your experience</li>
              <li>To administer and protect our business and website</li>
              <li>To track your progress and provide personalized learning experiences</li>
              <li>To send you relevant communications</li>
            </ul>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
            <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.</p>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-xl font-semibold mb-2">5. Data Retention</h2>
            <p>We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.</p>
            <p className="mt-2">To determine the appropriate retention period for personal data, we consider the amount, nature, and sensitivity of the personal data, the potential risk of harm from unauthorized use or disclosure of your personal data, the purposes for which we process your personal data, and whether we can achieve those purposes through other means, and the applicable legal requirements.</p>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-xl font-semibold mb-2">6. Your Legal Rights</h2>
            <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
            <p className="mt-2">If you wish to exercise any of these rights, please contact us.</p>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-xl font-semibold mb-2">7. Cookies</h2>
            <p>We use cookies and similar tracking technologies to track the activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.</p>
            <p className="mt-2">You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.</p>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-xl font-semibold mb-2">8. Third-Party Links</h2>
            <p>This website may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.</p>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-xl font-semibold mb-2">9. Changes to the Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.</p>
            <p className="mt-2">You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <p className="mt-2">Email: privacy@cittadinanza-b2.com</p>
          </section>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>© {currentYear} CILS B2 Cittadinanza Question of the Day. All rights reserved.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
