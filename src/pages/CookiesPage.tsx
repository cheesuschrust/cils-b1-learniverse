
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';

const CookiesPage = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy | CILS B1 Italian Citizenship Test Prep</title>
        <meta name="description" content="Information about how we use cookies on our website." />
      </Helmet>

      <div className="container mx-auto max-w-4xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              <p className="text-muted-foreground mb-4">
                Last Updated: April 8, 2025
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">1. What Are Cookies</h2>
              <p>
                Cookies are small text files that are placed on your computer, smartphone, or other device when you access the internet. They are widely used to make websites work more efficiently, as well as to provide information to the owners of the site.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">2. How We Use Cookies</h2>
              <p>
                We use cookies on our website for a variety of reasons, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as logging in or filling in forms.</li>
                <li><strong>Performance Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.</li>
                <li><strong>Functionality Cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.</li>
                <li><strong>Targeting Cookies:</strong> These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">3. Types of Cookies We Use</h2>
              <p>
                The following table provides more information about the cookies we use and why:
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 mb-6">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Cookie Name</th>
                      <th className="border border-gray-300 px-4 py-2">Purpose</th>
                      <th className="border border-gray-300 px-4 py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">_session</td>
                      <td className="border border-gray-300 px-4 py-2">Used to maintain your session as you navigate through the site.</td>
                      <td className="border border-gray-300 px-4 py-2">Session</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">_auth</td>
                      <td className="border border-gray-300 px-4 py-2">Used to authenticate logged-in users.</td>
                      <td className="border border-gray-300 px-4 py-2">1 year</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">_preferences</td>
                      <td className="border border-gray-300 px-4 py-2">Stores your preferences such as language, theme, and accessibility settings.</td>
                      <td className="border border-gray-300 px-4 py-2">1 year</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">_analytics</td>
                      <td className="border border-gray-300 px-4 py-2">Collects anonymous information about how you use our website to help us improve its functionality.</td>
                      <td className="border border-gray-300 px-4 py-2">2 years</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">4. How to Control Cookies</h2>
              <p>
                You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
              </p>
              <p>
                Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit <a href="https://www.aboutcookies.org/" className="text-primary hover:underline">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org/" className="text-primary hover:underline">www.allaboutcookies.org</a>.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">5. Cookie Consent</h2>
              <p>
                When you first visit our website, we ask for your consent to use cookies. You can choose to accept all cookies, only essential cookies, or to customize your preferences. You can change your preferences at any time by clicking on the "Cookie Settings" link in the footer of our website.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">6. Changes to This Cookie Policy</h2>
              <p>
                We may update this Cookie Policy from time to time. Any changes will be posted on this page and, where appropriate, notified to you.
              </p>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">7. Contact Us</h2>
              <p>
                If you have any questions about this Cookie Policy, please contact us at:
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

export default CookiesPage;
