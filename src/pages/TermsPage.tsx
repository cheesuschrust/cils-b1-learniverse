
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';

const TermsPage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | CILS B1 Italian Citizenship Test Prep</title>
        <meta name="description" content="Terms and conditions for using our Italian language learning platform." />
      </Helmet>

      <div className="container mx-auto max-w-4xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              <p className="text-muted-foreground mb-4">
                Last Updated: April 8, 2025
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the CILS B1 Italian Citizenship Test Prep platform, you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the service.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">2. Description of Service</h2>
              <p>
                The CILS B1 Italian Citizenship Test Prep platform provides educational content, practice exercises, and tools to assist users in preparing for the CILS B1 Italian language proficiency examination for citizenship purposes.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">3. User Accounts</h2>
              <p>
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
              </p>
              <p>
                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">4. Subscriptions and Payments</h2>
              <p>
                Some parts of the Service are provided with a fee as part of a subscription. You will be billed in advance on a recurring basis, depending on the type of subscription plan you select.
              </p>
              <p>
                At the end of each billing period, your subscription will automatically renew under the same conditions unless you cancel it or we cancel it. You may cancel your subscription renewal through your account management page.
              </p>
              <p>
                All subscriptions are non-refundable except as required by applicable law.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">5. Free Trial</h2>
              <p>
                We may, at our sole discretion, offer a subscription with a free trial for a limited period of time. At any time and without notice, we reserve the right to modify the terms of the free trial offer or to cancel it.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">6. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive property of the CILS B1 Italian Citizenship Test Prep platform and its licensors. The Service is protected by copyright, trademark, and other laws of both Italy and foreign countries.
              </p>
              <p>
                Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of the CILS B1 Italian Citizenship Test Prep platform.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">7. User Content</h2>
              <p>
                Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You retain any and all of your rights to any content you submit, post or display on or through the Service and you are responsible for protecting those rights.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">8. Links To Other Web Sites</h2>
              <p>
                Our Service may contain links to third-party web sites or services that are not owned or controlled by the CILS B1 Italian Citizenship Test Prep platform. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">9. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">10. Limitation of Liability</h2>
              <p>
                In no event shall the CILS B1 Italian Citizenship Test Prep platform, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">11. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of Italy, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">12. Changes</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">13. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> legal@cilsb1prep.com<br />
                <strong>Address:</strong> 123 Learning Lane, Education City, 12345
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TermsPage;
