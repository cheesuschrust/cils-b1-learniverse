
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Notification } from '@/components/ui/notification';
import { Bell, CheckCheck, ChevronRight, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Badge } from '@/components/ui/badge';

interface NotificationCenterProps {
  maxHeight?: string;
  className?: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  maxHeight = '400px',
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAllNotifications } = useNotifications();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Filter notifications by status
  const unreadNotifications = notifications.filter(n => !n.isRead);
  const unreadCount = unreadNotifications.length;
  
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);
  
  return (
    <div ref={containerRef} className={cn('relative', className)} data-testid="notification-bell">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 z-50 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
            data-testid="notifications-panel"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={markAllAsRead}
                  >
                    <CheckCheck className="mr-1 h-3.5 w-3.5" />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="all">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  All{' '}
                  {notifications.length > 0 && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({notifications.length})
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">
                  Unread{' '}
                  {unreadCount > 0 && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({unreadCount})
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <ScrollArea style={{ maxHeight }} className="p-1">
                <TabsContent value="all" className="m-0">
                  <div className="divide-y">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-2 ${!notification.isRead ? 'bg-muted/30' : ''}`}
                        >
                          <Notification
                            type={notification.type}
                            title={notification.title}
                            description={notification.message}
                            onClose={() => removeNotification(notification.id)}
                            className="border-transparent shadow-none bg-transparent"
                            actions={
                              <div className="flex gap-2 mt-2">
                                {!notification.isRead && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 text-xs"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    Mark as read
                                  </Button>
                                )}
                                {notification.actionLabel && (
                                  <Button 
                                    size="sm" 
                                    className="h-8 text-xs"
                                    onClick={() => {
                                      if (notification.actionHandler) {
                                        notification.actionHandler();
                                      }
                                      setIsOpen(false);
                                    }}
                                  >
                                    {notification.actionLabel}
                                    <ChevronRight className="ml-1 h-3.5 w-3.5" />
                                  </Button>
                                )}
                              </div>
                            }
                          />
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground text-sm">
                          No notifications
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="unread" className="m-0">
                  <div className="divide-y">
                    {unreadNotifications.length > 0 ? (
                      unreadNotifications.map((notification) => (
                        <div key={notification.id} className="p-2 bg-muted/30">
                          <Notification
                            type={notification.type}
                            title={notification.title}
                            description={notification.message}
                            onClose={() => removeNotification(notification.id)}
                            className="border-transparent shadow-none bg-transparent"
                            actions={
                              <div className="flex gap-2 mt-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 text-xs"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Mark as read
                                </Button>
                                {notification.actionLabel && (
                                  <Button 
                                    size="sm" 
                                    className="h-8 text-xs"
                                    onClick={() => {
                                      if (notification.actionHandler) {
                                        notification.actionHandler();
                                      }
                                      setIsOpen(false);
                                    }}
                                  >
                                    {notification.actionLabel}
                                    <ChevronRight className="ml-1 h-3.5 w-3.5" />
                                  </Button>
                                )}
                              </div>
                            }
                          />
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <CheckCheck className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground text-sm">
                          No unread notifications
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </ScrollArea>
              
              {notifications.length > 0 && (
                <div className="p-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={clearAllNotifications}
                  >
                    Clear all notifications
                  </Button>
                </div>
              )}
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { NotificationCenter };
