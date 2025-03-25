
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  ArrowLeft,
  ShieldCheck, 
  Eye, 
  Server, 
  HardDrive, 
  UserCog, 
  Cookie, 
  Globe,
  Clock,
  Lock
} from 'lucide-react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  
  const lastUpdated = "August 15, 2023";
  const effectiveDate = "September 1, 2023";
  
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Italian Learning App</title>
        <meta name="description" content="Privacy Policy for Italian Learning App - Learn how we protect your data" />
      </Helmet>
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-8">
          <Clock className="h-4 w-4 mr-1" />
          <span>Last Updated: {lastUpdated} | Effective: {effectiveDate}</span>
        </div>
        
        <div className="bg-muted/30 border rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <ShieldCheck className="h-8 w-8 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Your Privacy Matters</h2>
              <p className="text-muted-foreground">
                At Italian Learning App, we are committed to protecting your privacy and personal data. 
                This Privacy Policy explains how we collect, use, and safeguard your information when you 
                use our services. We've designed this policy to be transparent and easy to understand.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="mb-4">
              This Privacy Policy applies to Italian Learning App's website, mobile applications, 
              and related services (collectively referred to as the "Service"). By using our Service, 
              you agree to the collection and use of information in accordance with this policy.
            </p>
            <p>
              We comply with the General Data Protection Regulation (GDPR) and other applicable 
              data protection laws. For users in the European Economic Area (EEA), we serve as 
              the data controller for the personal information you provide.
            </p>
          </section>
          
          <Separator />
          
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Information We Collect</h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="personal-info">
                <AccordionTrigger>Personal Information</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">We may collect the following personal information:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Contact information (email address, name)</li>
                    <li>Account credentials (username, password)</li>
                    <li>Profile information (profile picture, language preferences)</li>
                    <li>Learning progress and performance data</li>
                    <li>Payment information (for premium subscriptions)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="usage-data">
                <AccordionTrigger>Usage Data</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">We collect information about how you interact with our Service:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Access times and dates</li>
                    <li>Pages viewed and features used</li>
                    <li>Learning patterns and progress</li>
                    <li>Device information (type, operating system, browser)</li>
                    <li>IP address and approximate location (country/region)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="cookies">
                <AccordionTrigger>Cookies and Similar Technologies</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">We use cookies and similar tracking technologies to track activity on our Service and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.</p>
                  <p className="mb-2">Types of cookies we use:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Essential cookies:</strong> Required for the Service to function properly</li>
                    <li><strong>Functional cookies:</strong> Remember your preferences and settings</li>
                    <li><strong>Analytics cookies:</strong> Help us understand how you use our Service</li>
                    <li><strong>Marketing cookies:</strong> Used to deliver relevant advertisements (if applicable)</li>
                  </ul>
                  <p className="mt-2">You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
          
          <Separator />
          
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Server className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
            </div>
            
            <p className="mb-4">We use the information we collect for various purposes:</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Service Provision</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Provide, maintain, and improve our Service</li>
                  <li>Personalize your learning experience</li>
                  <li>Process transactions and manage your account</li>
                  <li>Track your progress and provide feedback</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Communication</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Respond to your inquiries and support requests</li>
                  <li>Send updates about your account or the Service</li>
                  <li>Provide news and information about features or services</li>
                  <li>Send marketing communications (with your consent)</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Analysis and Improvement</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Analyze usage patterns and trends</li>
                  <li>Monitor and improve the effectiveness of our Service</li>
                  <li>Develop new features and functionality</li>
                  <li>Conduct research to enhance learning methodologies</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Security and Legal Compliance</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Protect against unauthorized access or illegal activity</li>
                  <li>Investigate and address violations of our Terms of Service</li>
                  <li>Comply with legal obligations and regulations</li>
                  <li>Establish, exercise, or defend legal claims</li>
                </ul>
              </div>
            </div>
          </section>
          
          <Separator />
          
          <section>
            <div className="flex items-center gap-2 mb-4">
              <HardDrive className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Data Retention and Storage</h2>
            </div>
            
            <p className="mb-4">
              We retain your personal information only for as long as necessary to fulfill the purposes 
              outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
            
            <p className="mb-4">
              Your data is stored securely on servers located in the European Union. We implement 
              appropriate technical and organizational measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Account Deletion</h3>
              <p className="text-sm">
                You can request the deletion of your account at any time through your account settings 
                or by contacting our support team. When you delete your account, we will remove your 
                personal information from our active databases, but some information may be retained 
                in our backups for a limited period or as required by law.
              </p>
            </div>
          </section>
          
          <Separator />
          
          <section>
            <div className="flex items-center gap-2 mb-4">
              <UserCog className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Your Data Protection Rights</h2>
            </div>
            
            <p className="mb-4">
              Under the GDPR and other applicable data protection laws, you have certain rights 
              regarding your personal information:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Right to Access</h3>
                <p className="text-sm">
                  You have the right to request copies of your personal information. We may charge a small fee for this service.
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Right to Rectification</h3>
                <p className="text-sm">
                  You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Right to Erasure</h3>
                <p className="text-sm">
                  You have the right to request that we erase your personal information, under certain conditions.
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Right to Restrict Processing</h3>
                <p className="text-sm">
                  You have the right to request that we restrict the processing of your personal information, under certain conditions.
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Right to Data Portability</h3>
                <p className="text-sm">
                  You have the right to request that we transfer the data we have collected to another organization, or directly to you, under certain conditions.
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Right to Object</h3>
                <p className="text-sm">
                  You have the right to object to our processing of your personal information, under certain conditions.
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-4 border rounded-lg bg-muted/30">
              <h3 className="font-medium mb-2">How to Exercise Your Rights</h3>
              <p className="text-sm mb-2">
                You can exercise any of these rights by contacting us at <a href="mailto:privacy@italianlearning.app" className="text-primary hover:underline">privacy@italianlearning.app</a>.
                We will respond to your request within 30 days.
              </p>
              <p className="text-sm">
                If you are located in the EU, you also have the right to lodge a complaint with your local 
                data protection authority if you believe we have not complied with applicable data protection laws.
              </p>
            </div>
          </section>
          
          <Separator />
          
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">International Data Transfers</h2>
            </div>
            
            <p className="mb-4">
              Your information may be transferred to — and maintained on — computers located outside of your 
              state, province, country, or other governmental jurisdiction where the data protection laws may 
              differ from those of your jurisdiction.
            </p>
            
            <p className="mb-4">
              If you are located outside the United States and choose to provide information to us, please note 
              that we transfer the data, including personal information, to the European Union and process it there.
            </p>
            
            <p>
              For transfers to countries without an adequate level of protection as determined by the European Commission, 
              we implement appropriate safeguards such as Standard Contractual Clauses approved by the European Commission.
            </p>
          </section>
          
          <Separator />
          
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Cookie className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Cookie Policy</h2>
            </div>
            
            <p className="mb-4">
              Our Cookie Policy explains how we use cookies and similar technologies to recognize you when you 
              visit our website or use our Service. It explains what these technologies are and why we use them, 
              as well as your rights to control our use of them.
            </p>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Cookie Management</h3>
              <p className="text-sm mb-2">
                You can set your browser to refuse all or some browser cookies, or to alert you when cookies are being sent. 
                To learn more about how to manage cookies in your web browser, you can visit:
              </p>
              <ul className="list-disc pl-6 text-sm">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Apple Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></li>
              </ul>
            </div>
          </section>
          
          <Separator />
          
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Security Measures</h2>
            </div>
            
            <p className="mb-4">
              The security of your personal information is important to us. We implement a variety of security 
              measures to maintain the safety of your personal information when you use our Service:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>All sensitive data is encrypted using industry-standard encryption technologies</li>
              <li>Access to personal data is restricted to authorized personnel only</li>
              <li>Regular security assessments and penetration testing</li>
              <li>Continuous monitoring for unauthorized access or data breaches</li>
              <li>Secure authentication mechanisms including multi-factor authentication</li>
            </ul>
            
            <p>
              While we strive to use commercially acceptable means to protect your personal information, 
              no method of transmission over the Internet or method of electronic storage is 100% secure. 
              Therefore, we cannot guarantee its absolute security.
            </p>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
            
            <p className="mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last Updated" date at the top.
            </p>
            
            <p className="mb-4">
              For significant changes, we will provide a more prominent notice, which may include email notification 
              of Privacy Policy changes for registered users.
            </p>
            
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this 
              Privacy Policy are effective when they are posted on this page.
            </p>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            
            <p className="mb-4">
              If you have any questions about this Privacy Policy, you can contact us:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">By email:</h3>
                <a href="mailto:privacy@italianlearning.app" className="text-primary hover:underline">privacy@italianlearning.app</a>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">By mail:</h3>
                <address className="not-italic">
                  Italian Learning App<br />
                  Data Protection Officer<br />
                  123 Language Street<br />
                  Milan, 20121<br />
                  Italy
                </address>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Data Protection Officer:</h3>
              <p>
                You can contact our Data Protection Officer directly at <a href="mailto:dpo@italianlearning.app" className="text-primary hover:underline">dpo@italianlearning.app</a>
              </p>
            </div>
          </section>
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Previous Page
          </Button>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
