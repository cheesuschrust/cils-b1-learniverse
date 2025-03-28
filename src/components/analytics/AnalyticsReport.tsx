import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Printer,
  Share2
} from 'lucide-react';
import { format } from 'date-fns';
import ProgressOverTime from './ProgressOverTime';
import CategoryPerformance from './CategoryPerformance';
import KnowledgeGaps from './KnowledgeGaps';
import { useAuth } from '@/contexts/AuthContext';
import { DateRangeOption } from '@/hooks/useAnalytics';
import html2pdf from 'html2pdf.js';
import { useToast } from '@/components/ui/use-toast';

interface AnalyticsReportProps {
  onClose: () => void;
  reportData: {
    activityData: any[];
    categoryData: any[];
    knowledgeGaps: any[];
    sessionStats: any;
    goals: any[];
    streak: any;
    recommendations: any[];
    dateRange: DateRangeOption;
  };
}

const AnalyticsReport: React.FC<AnalyticsReportProps> = ({ 
  onClose,
  reportData
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const reportRef = React.useRef<HTMLDivElement>(null);
  
  const getDateRangeLabel = (range: DateRangeOption): string => {
    switch (range) {
      case '7d':
        return 'Last 7 Days';
      case '30d':
        return 'Last 30 Days';
      case '90d':
        return 'Last 90 Days';
      case 'all':
        return 'All Time';
      default:
        return 'Custom Range';
    }
  };
  
  const getTotalQuestionsAnswered = () => {
    return reportData.activityData.reduce((sum, day) => sum + day.total, 0);
  };
  
  const getAverageScore = () => {
    const daysWithActivity = reportData.activityData.filter(day => day.attempts > 0);
    if (daysWithActivity.length === 0) return 0;
    
    const totalScore = daysWithActivity.reduce((sum, day) => sum + day.score, 0);
    return Math.round(totalScore / daysWithActivity.length);
  };
  
  const getActiveStudyDays = () => {
    return reportData.activityData.filter(day => day.attempts > 0).length;
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    
    try {
      const opt = {
        margin: 10,
        filename: `learning-analytics-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your report...",
      });
      
      await html2pdf()
        .from(reportRef.current)
        .set(opt)
        .save();
        
      toast({
        title: "PDF Downloaded",
        description: "Your analytics report has been downloaded successfully."
      });
    } catch (error) {
      toast({
        title: "Error generating PDF",
        description: "There was a problem creating your report. Please try again.",
        variant: "destructive"
      });
      console.error('Error generating PDF:', error);
    }
  };
  
  const handleExportCSV = () => {
    // Convert activity data to CSV
    const headers = ['Date', 'Total Questions', 'Correct Answers', 'Score', 'Time Spent'];
    const rows = reportData.activityData.map(day => [
      day.date,
      day.total,
      day.correct,
      day.score,
      day.timeSpent
    ]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `learning-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "CSV Downloaded",
      description: "Your analytics data has been exported as CSV."
    });
  };
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container py-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Button variant="ghost" onClick={onClose}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Analytics
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownloadPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
      
      <div ref={reportRef} className="bg-background p-6 rounded-lg shadow-sm print:shadow-none">
        <div className="border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold">Learning Analytics Report</h1>
          <div className="flex justify-between mt-2">
            <p className="text-muted-foreground">
              {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.email}
            </p>
            <p className="text-muted-foreground">
              {getDateRangeLabel(reportData.dateRange)} • Generated on {format(new Date(), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="border rounded-lg p-4 text-center">
            <p className="text-muted-foreground text-sm">Questions Answered</p>
            <p className="text-3xl font-bold mt-1">{getTotalQuestionsAnswered()}</p>
          </div>
          
          <div className="border rounded-lg p-4 text-center">
            <p className="text-muted-foreground text-sm">Average Score</p>
            <p className="text-3xl font-bold mt-1">{getAverageScore()}%</p>
          </div>
          
          <div className="border rounded-lg p-4 text-center">
            <p className="text-muted-foreground text-sm">Current Streak</p>
            <p className="text-3xl font-bold mt-1">{reportData.streak?.currentStreak || 0} days</p>
          </div>
        </div>
        
        <div className="space-y-6 mb-6">
          <h2 className="text-2xl font-bold">Progress Over Time</h2>
          <div className="h-[300px] border rounded-lg p-4">
            <ProgressOverTime data={reportData.activityData} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Performance by Category</h2>
            <div className="h-[300px] border rounded-lg p-4">
              <CategoryPerformance data={reportData.categoryData} />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Knowledge Gaps</h2>
            <div className="border rounded-lg p-4">
              <KnowledgeGaps data={reportData.knowledgeGaps} />
            </div>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <h2 className="text-2xl font-bold">Study Recommendations</h2>
          <div className="border rounded-lg p-4">
            <ul className="space-y-2">
              {reportData.recommendations.map((rec, index) => (
                <li key={index} className="flex gap-2">
                  <span>•</span>
                  <div>
                    <p className="font-medium">{rec.focus}</p>
                    <p className="text-sm text-muted-foreground">{rec.reason}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Session Statistics</h2>
          <div className="border rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-xl font-bold">{reportData.sessionStats?.totalSessions || 0}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Avg. Session Length</p>
                <p className="text-xl font-bold">{reportData.sessionStats?.averageSessionLength || 0} min</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Questions per Session</p>
                <p className="text-xl font-bold">{reportData.sessionStats?.averageQuestionsPerSession || 0}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-xl font-bold">{reportData.sessionStats?.completionRate || 0}%</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Time per Question</p>
                <p className="text-xl font-bold">{reportData.sessionStats?.timePerQuestion || 0} sec</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Optimal Study Time</p>
                <p className="text-xl font-bold">{reportData.sessionStats?.optimalTimeOfDay || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-muted-foreground mt-8 print:mt-16 text-sm">
          <p>This report was generated on {format(new Date(), 'MMMM d, yyyy')} at {format(new Date(), 'h:mm a')}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReport;
