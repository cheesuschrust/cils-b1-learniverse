
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';

const EULAPage = () => {
  return (
    <>
      <Helmet>
        <title>End User License Agreement | CILS B1 Italian Citizenship Test Prep</title>
        <meta name="description" content="End User License Agreement for the CILS B1 Italian Citizenship Test Prep platform." />
      </Helmet>

      <div className="container mx-auto max-w-4xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">End User License Agreement (EULA)</h1>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              <p className="text-muted-foreground mb-4">
                Last Updated: April 8, 2025
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">1. Introduction</h2>
              <p>
                This End User License Agreement ("EULA") is a legal agreement between you (either an individual or a single entity) and CILS B1 Italian Citizenship Test Prep regarding your use of the CILS B1 Italian Citizenship Test Prep application, software, and services (together, the "Application").
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">2. License Grant</h2>
              <p>
                CILS B1 Italian Citizenship Test Prep grants you a limited, non-exclusive, non-transferable, revocable license to use the Application for your personal, non-commercial purposes strictly in accordance with the terms of this EULA.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">3. Restrictions</h2>
              <p>
                You agree not to, and you will not permit others to:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>License, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose or otherwise commercially exploit the Application or make the Application available to any third party.</li>
                <li>Modify, make derivative works of, disassemble, decrypt, reverse compile or reverse engineer any part of the Application.</li>
                <li>Remove, alter or obscure any proprietary notice (including any notice of copyright or trademark) of CILS B1 Italian Citizenship Test Prep or its affiliates, partners, suppliers or the licensors of the Application.</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">4. Intellectual Property Rights</h2>
              <p>
                The Application, including without limitation all copyrights, patents, trademarks, trade secrets and other intellectual property rights are, and shall remain, the sole and exclusive property of CILS B1 Italian Citizenship Test Prep.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">5. User-Generated Content</h2>
              <p>
                Users may have the ability to post content on the Application. You understand that all information, data, text, software, music, sound, photographs, graphics, video, messages, or other materials ("Content"), whether publicly posted or privately transmitted, are the sole responsibility of the person from whom such Content originated.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">6. Third-Party Services</h2>
              <p>
                The Application may display, include or make available third-party content (including data, information, applications and other products services) or provide links to third-party websites or services ("Third-Party Services"). You acknowledge and agree that CILS B1 Italian Citizenship Test Prep shall not be responsible for any Third-Party Services.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">7. Privacy Policy</h2>
              <p>
                CILS B1 Italian Citizenship Test Prep collects, stores, maintains, and shares information about you in accordance with its Privacy Policy, which is available at [Privacy Policy URL]. By accepting this EULA, you acknowledge that you have read and understood the Privacy Policy.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">8. Term and Termination</h2>
              <p>
                This EULA shall remain in effect until terminated by you or CILS B1 Italian Citizenship Test Prep. CILS B1 Italian Citizenship Test Prep may, in its sole discretion, at any time and for any or no reason, suspend or terminate this EULA with or without prior notice.
              </p>
              <p>
                This EULA will terminate immediately, without prior notice from CILS B1 Italian Citizenship Test Prep, in the event that you fail to comply with any provision of this EULA.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">9. Indemnification</h2>
              <p>
                You agree to indemnify and hold CILS B1 Italian Citizenship Test Prep and its parents, subsidiaries, affiliates, officers, employees, agents, partners and licensors harmless from any claim or demand, including reasonable attorneys' fees, due to or arising out of your: (a) use of the Application; (b) violation of this EULA or any law or regulation; or (c) violation of any right of a third party.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">10. No Warranties</h2>
              <p>
                The Application is provided to you "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, CILS B1 Italian Citizenship Test Prep expressly disclaims all warranties, whether express, implied, statutory or otherwise.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">11. Limitation of Liability</h2>
              <p>
                To the extent permitted by law, in no event shall CILS B1 Italian Citizenship Test Prep be liable for personal injury, or any incidental, special, indirect or consequential damages whatsoever, including, without limitation, damages for loss of profits, loss of data, business interruption or any other commercial damages or losses, arising out of or related to your use or inability to use the Application.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">12. Governing Law</h2>
              <p>
                This EULA is governed by and construed in accordance with the internal laws of Italy without giving effect to any choice or conflict of law provision or rule. Any legal suit, action or proceeding arising out of or related to this EULA shall be instituted exclusively in the federal courts of Italy.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">13. Contact Information</h2>
              <p>
                If you have any questions about this EULA, please contact us at:
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

export default EULAPage;
