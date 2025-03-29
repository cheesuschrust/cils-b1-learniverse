import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { CardFooter } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SEOManager: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">SEO Manager</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Page Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="page-title" className="block text-sm font-medium text-gray-700">
              Page Title
            </label>
            <input
              type="text"
              id="page-title"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter page title"
            />
          </div>
          <div>
            <label htmlFor="meta-description" className="block text-sm font-medium text-gray-700">
              Meta Description
            </label>
            <textarea
              id="meta-description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter meta description"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Keywords</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="primary-keyword" className="block text-sm font-medium text-gray-700">
              Primary Keyword
            </label>
            <input
              type="text"
              id="primary-keyword"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter primary keyword"
            />
          </div>
          <div>
            <label htmlFor="secondary-keywords" className="block text-sm font-medium text-gray-700">
              Secondary Keywords
            </label>
            <input
              type="text"
              id="secondary-keywords"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter secondary keywords (comma-separated)"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Indexing</h2>
        <div className="flex items-center space-x-4">
          <label htmlFor="indexable" className="flex items-center">
            <input
              type="checkbox"
              id="indexable"
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <span className="ml-2 text-gray-700">Allow indexing</span>
          </label>
          <label htmlFor="follow" className="flex items-center">
            <input
              type="checkbox"
              id="follow"
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <span className="ml-2 text-gray-700">Follow links</span>
          </label>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Sitemap</h2>
        <div className="flex items-center space-x-4">
          <label htmlFor="sitemap-priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.2">0.2</SelectItem>
              <SelectItem value="0.5">0.5</SelectItem>
              <SelectItem value="0.8">0.8</SelectItem>
              <SelectItem value="1.0">1.0</SelectItem>
            </SelectContent>
          </Select>
          <label htmlFor="sitemap-changefreq" className="block text-sm font-medium text-gray-700">
            Change Frequency
          </label>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="always">Always</SelectItem>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Status</h2>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-yellow-500 text-white mr-2">
            Important
          </Badge>
          <p className="text-gray-700">
            Review and update these settings regularly to maintain optimal SEO performance.
          </p>
        </div>
      </div>

      <CardFooter>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          Save Changes
        </button>
      </CardFooter>
    </div>
  );
};

export default SEOManager;
