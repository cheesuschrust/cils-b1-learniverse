
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';

const GDPRPage = () => {
  return (
    <>
      <Helmet>
        <title>GDPR Compliance | CILS B1 Italian Citizenship Test Prep</title>
        <meta name="description" content="Information about our GDPR compliance and data protection measures." />
      </Helmet>

      <div className="container mx-auto max-w-4xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">GDPR Compliance</h1>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              <p className="text-muted-foreground mb-4">
                Last Updated: April 8, 2025
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">1. Introduction</h2>
              <p>
                At CILS B1 Italian Citizenship Test Prep, we are committed to protecting and respecting your privacy in compliance with the EU General Data Protection Regulation (GDPR). This GDPR Compliance Statement explains how we collect, use, and store your personal data.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">2. Data Controller</h2>
              <p>
                For the purposes of the GDPR, CILS B1 Italian Citizenship Test Prep is the data controller of your personal data. This means that we determine the purposes and ways in which your personal data is processed.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">3. Legal Basis for Processing Personal Data</h2>
              <p>
                We process your personal data based on one or more of the following legal bases:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>Your consent to the processing of your personal data for one or more specific purposes.</li>
                <li>The necessity to perform a contract with you or to take steps at your request before entering into a contract.</li>
                <li>The necessity to comply with legal obligations.</li>
                <li>The necessity to protect your vital interests or those of another natural person.</li>
                <li>The necessity to perform a task carried out in the public interest.</li>
                <li>The necessity for the purposes of the legitimate interests pursued by us or by a third party, except where such interests are overridden by your interests or fundamental rights and freedoms.</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">4. Your Rights</h2>
              <p>
                Under the GDPR, you have the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li><strong>Right to Access:</strong> You have the right to obtain confirmation whether we process your personal data, and if so, you can access your personal data and certain information about the processing.</li>
                <li><strong>Right to Rectification:</strong> You have the right to have inaccurate personal data corrected or completed if it is incomplete.</li>
                <li><strong>Right to Erasure (Right to be Forgotten):</strong> You have the right to have your personal data erased in certain circumstances.</li>
                <li><strong>Right to Restrict Processing:</strong> You have the right to request the restriction of processing of your personal data in certain circumstances.</li>
                <li><strong>Right to Data Portability:</strong> You have the right to receive your personal data in a structured, commonly used, and machine-readable format and to transmit those data to another controller.</li>
                <li><strong>Right to Object:</strong> You have the right to object to the processing of your personal data in certain circumstances.</li>
                <li><strong>Right Not to Be Subject to Automated Decision-Making:</strong> You have the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning you or similarly significantly affects you.</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">5. Data Protection Measures</h2>
              <p>
                We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>Encryption of personal data where appropriate.</li>
                <li>Regular testing, assessment, and evaluation of the effectiveness of our security measures.</li>
                <li>Measures to ensure the confidentiality, integrity, availability, and resilience of processing systems and services.</li>
                <li>Measures to restore access to personal data in a timely manner in the event of a physical or technical incident.</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">6. Data Breaches</h2>
              <p>
                In the event of a personal data breach, we will notify the relevant supervisory authority without undue delay and, where feasible, not later than 72 hours after having become aware of it, unless the breach is unlikely to result in a risk to your rights and freedoms.
              </p>
              <p>
                If the breach is likely to result in a high risk to your rights and freedoms, we will also notify you without undue delay.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">7. Data Protection Officer</h2>
              <p>
                We have appointed a Data Protection Officer (DPO) who is responsible for overseeing questions in relation to this GDPR Compliance Statement. If you have any questions about this statement, including any requests to exercise your legal rights, please contact our DPO using the details set out below:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> dpo@cilsb1prep.com<br />
                <strong>Address:</strong> 123 Learning Lane, Education City, 12345
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">8. Changes to This GDPR Compliance Statement</h2>
              <p>
                We may update this GDPR Compliance Statement from time to time. Any changes will be posted on this page and, where appropriate, notified to you.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">9. Contact Us</h2>
              <p>
                If you have any questions about this GDPR Compliance Statement, please contact us at:
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

export default GDPRPage;
