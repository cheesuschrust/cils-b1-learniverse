
import React, { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { User, Globe, BellRing, MoonStar, Languages, Sparkles } from 'lucide-react';
import { ConfidenceIndicator } from '@/components/ai/ConfidenceIndicator';

interface PersonalizationStepProps {
  data?: {
    nickname?: string;
    primaryLanguage?: string;
    goals?: string;
    reminders?: boolean;
    themePreference?: string;
    aiAssistance?: boolean;
  };
  onChange?: (data: any) => void;
}

const PersonalizationStep: React.FC<PersonalizationStepProps> = ({ data = {}, onChange }) => {
  const [nickname, setNickname] = useState(data.nickname || "");
  const [primaryLanguage, setPrimaryLanguage] = useState(data.primaryLanguage || "english");
  const [goals, setGoals] = useState(data.goals || "");
  const [reminders, setReminders] = useState(data.reminders !== undefined ? data.reminders : true);
  const [themePreference, setThemePreference] = useState(data.themePreference || "light");
  const [aiAssistance, setAiAssistance] = useState(data.aiAssistance !== undefined ? data.aiAssistance : true);

  const handleChange = (field: string, value: any) => {
    const updatedValues = {
      nickname,
      primaryLanguage,
      goals,
      reminders,
      themePreference,
      aiAssistance,
      [field]: value
    };
    
    if (onChange) {
      onChange(updatedValues);
    }

    // Update the local state
    switch (field) {
      case 'nickname':
        setNickname(value);
        break;
      case 'primaryLanguage':
        setPrimaryLanguage(value);
        break;
      case 'goals':
        setGoals(value);
        break;
      case 'reminders':
        setReminders(value);
        break;
      case 'themePreference':
        setThemePreference(value);
        break;
      case 'aiAssistance':
        setAiAssistance(value);
        break;
    }
  };

  return (
    <CardContent className="pt-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Personal Information</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Customize your learning experience
        </p>
        
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="nickname" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nickname (optional)
            </Label>
            <Input
              id="nickname"
              placeholder="How would you like to be called?"
              value={nickname}
              onChange={(e) => handleChange('nickname', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              We'll use this to personalize your learning experience
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="primary-language" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Primary Language
            </Label>
            <Select value={primaryLanguage} onValueChange={(value) => handleChange('primaryLanguage', value)}>
              <SelectTrigger id="primary-language">
                <SelectValue placeholder="Select your primary language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="german">German</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
                <SelectItem value="japanese">Japanese</SelectItem>
                <SelectItem value="korean">Korean</SelectItem>
                <SelectItem value="russian">Russian</SelectItem>
                <SelectItem value="arabic">Arabic</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              We'll use this to provide better explanations
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Your Learning Goals</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Tell us why you're learning Italian
        </p>
        
        <div className="grid gap-2">
          <Label htmlFor="goals">What are your main goals for learning Italian?</Label>
          <Textarea
            id="goals"
            placeholder="E.g., Preparing for citizenship exam, traveling to Italy, connecting with family..."
            value={goals}
            onChange={(e) => handleChange('goals', e.target.value)}
            rows={4}
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-muted-foreground">
              Your goals help us customize learning materials
            </p>
            <Badge variant="outline" className="text-xs">
              <ConfidenceIndicator value={goals.length > 20 ? 90 : goals.length > 10 ? 70 : 30} />
              <span className="ml-1">CILS B1 Alignment</span>
            </Badge>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications" className="flex items-center gap-2">
                <BellRing className="h-4 w-4" />
                Study Reminders
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications to keep your learning on track
              </p>
            </div>
            <Switch
              id="notifications"
              checked={reminders}
              onCheckedChange={(checked) => handleChange('reminders', checked)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="theme-preference" className="flex items-center gap-2">
              <MoonStar className="h-4 w-4" />
              Interface Theme
            </Label>
            <Select value={themePreference} onValueChange={(value) => handleChange('themePreference', value)}>
              <SelectTrigger id="theme-preference">
                <SelectValue placeholder="Select your preferred theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System Default</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <Label htmlFor="ai-assistance" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                AI-Enhanced Learning
              </Label>
              <p className="text-sm text-muted-foreground">
                Use AI to personalize study materials and track CILS alignment
              </p>
            </div>
            <Switch
              id="ai-assistance"
              checked={aiAssistance}
              onCheckedChange={(checked) => handleChange('aiAssistance', checked)}
            />
          </div>
        </div>
      </div>
    </CardContent>
  );
};

export default PersonalizationStep;
