
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Cpu, AlertCircle, CheckCircle2, MonitorSmartphone, Server, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import AISettings from "./AISettings";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAIUtils } from '@/contexts/AIUtilsContext';

interface AIStatusProps {
  showDetails?: boolean;
  minimal?: boolean;
}

const AIStatus = ({ showDetails = false, minimal = false }: AIStatusProps) => {
  const { aiPreference } = useUserPreferences();
  const { isAIEnabled } = useAIUtils();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  
  // Simulate loading state
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSettingsClick = () => {
    if (minimal) {
      navigate('/app/settings');
    } else {
      setShowSettings(true);
    }
  };
  
  if (minimal) {
    return (
      <Badge 
        variant={isAIEnabled ? "default" : "outline"}
        className="cursor-pointer transition-colors hover:bg-secondary"
        onClick={handleSettingsClick}
      >
        <Cpu className="h-3 w-3 mr-1" />
        {isAIEnabled ? 'AI On' : 'AI Off'}
      </Badge>
    );
  }
  
  return (
    <>
      <Popover open={showSettings} onOpenChange={setShowSettings}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={`gap-1 ${!isAIEnabled ? 'text-muted-foreground' : ''}`}
          >
            <Cpu className={`h-4 w-4 ${isAIEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
            {!isLoaded ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <>
                {isAIEnabled ? (
                  <>AI Enabled <CheckCircle2 className="h-3 w-3 text-green-500" /></>
                ) : (
                  <>AI Disabled <AlertCircle className="h-3 w-3 text-amber-500" /></>
                )}
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          {showDetails ? (
            <AISettings onClose={() => setShowSettings(false)} isAdmin={user?.role === 'admin'} />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-medium flex items-center">
                  <Cpu className="h-4 w-4 mr-2" />
                  AI Status
                </div>
                <Badge variant={isAIEnabled ? "default" : "outline"}>
                  {isAIEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              
              {isAIEnabled && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <Info className="h-3 w-3 mr-1" /> Model Size:
                    </span>
                    <span className="font-medium capitalize">{aiPreference.modelSize}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <Info className="h-3 w-3 mr-1" /> Processing:
                    </span>
                    <span className="font-medium flex items-center">
                      {aiPreference.processOnDevice ? (
                        <>
                          <MonitorSmartphone className="h-3 w-3 mr-1" /> On-Device
                        </>
                      ) : (
                        <>
                          <Server className="h-3 w-3 mr-1" /> Cloud
                        </>
                      )}
                    </span>
                  </div>
                </div>
              )}
              
              <Button size="sm" className="w-full" onClick={handleSettingsClick}>
                Manage AI Settings
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
};

export default AIStatus;
