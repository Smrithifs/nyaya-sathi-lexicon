import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  MapPin, 
  User, 
  FileText,
  Bell,
  Edit,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format, isToday, isTomorrow, isSameDay } from "date-fns";

type EventType = 'hearing' | 'filing' | 'meeting' | 'misc';
type ReminderType = '10min' | '1hour' | '1day';

interface CalendarEvent {
  id: string;
  title: string;
  clientName: string;
  court: string;
  date: Date;
  time: string;
  type: EventType;
  reminder: ReminderType;
  notes?: string;
}

const eventTypeColors = {
  hearing: 'bg-red-100 text-red-800 border-red-200',
  filing: 'bg-green-100 text-green-800 border-green-200',
  meeting: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  misc: 'bg-blue-100 text-blue-800 border-blue-200'
};

const eventTypeIcons = {
  hearing: '🔴',
  filing: '🟢',
  meeting: '🟡',
  misc: '🔵'
};

const HearingTracker: React.FC = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Mehra v. State Hearing',
      clientName: 'Mr. Mehra',
      court: 'Mumbai High Court',
      date: new Date(),
      time: '10:30',
      type: 'hearing',
      reminder: '1hour',
      notes: 'Criminal case - appearance required'
    }
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    clientName: string;
    court: string;
    date: Date;
    time: string;
    type: EventType;
    reminder: ReminderType;
    notes: string;
  }>({
    title: '',
    clientName: '',
    court: '',
    date: new Date(),
    time: '',
    type: 'hearing',
    reminder: '1hour',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      clientName: '',
      court: '',
      date: selectedDate || new Date(),
      time: '',
      type: 'hearing',
      reminder: '1hour',
      notes: ''
    });
    setEditingEvent(null);
  };

  const handleCalendarDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      // Update form data to pre-fill the selected date
      setFormData(prev => ({ ...prev, date: date }));
    }
  };

  const handleAddEventClick = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleAddEvent = () => {
    if (!formData.title || !formData.clientName || !formData.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newEvent: CalendarEvent = {
      id: editingEvent?.id || Date.now().toString(),
      title: formData.title,
      clientName: formData.clientName,
      court: formData.court,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      reminder: formData.reminder,
      notes: formData.notes
    };

    if (editingEvent) {
      setEvents(prev => prev.map(event => 
        event.id === editingEvent.id ? newEvent : event
      ));
      toast({
        title: "Event Updated",
        description: "Your calendar event has been updated successfully."
      });
    } else {
      setEvents(prev => [...prev, newEvent]);
      toast({
        title: "Event Added",
        description: "Your calendar event has been added successfully."
      });
    }

    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setFormData({
      title: event.title,
      clientName: event.clientName,
      court: event.court,
      date: event.date,
      time: event.time,
      type: event.type,
      reminder: event.reminder,
      notes: event.notes || ''
    });
    setEditingEvent(event);
    setIsAddDialogOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    toast({
      title: "Event Deleted",
      description: "The calendar event has been removed."
    });
  };

  const exportToGoogleCalendar = (event: CalendarEvent) => {
    const startDate = new Date(event.date);
    const [hours, minutes] = event.time.split(':');
    startDate.setHours(parseInt(hours), parseInt(minutes));
    
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1); // 1 hour duration
    
    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
    googleCalendarUrl.searchParams.set('action', 'TEMPLATE');
    googleCalendarUrl.searchParams.set('text', event.title);
    googleCalendarUrl.searchParams.set('dates', `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`);
    googleCalendarUrl.searchParams.set('details', `Client: ${event.clientName}\nType: ${event.type}\nNotes: ${event.notes || 'N/A'}`);
    googleCalendarUrl.searchParams.set('location', event.court);
    
    window.open(googleCalendarUrl.toString(), '_blank');
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(event.date, date)
    );
  };

  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    return getEventsForDate(selectedDate);
  };

  const upcomingEvents = events
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const hasEventsOnDate = (date: Date) => {
    return events.some(event => isSameDay(event.date, date));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hearing & Deadline Tracker</h1>
            <p className="text-gray-600">Manage your court schedules and legal deadlines</p>
          </div>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddEventClick} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Case Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Mehra v. State"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name / Case Number *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                  placeholder="e.g., Mr. Mehra"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="court">Court / Venue</Label>
                <Input
                  id="court"
                  value={formData.court}
                  onChange={(e) => setFormData(prev => ({ ...prev, court: e.target.value }))}
                  placeholder="e.g., Mumbai High Court"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={format(formData.date, 'yyyy-MM-dd')}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: new Date(e.target.value) }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Event Type</Label>
                <Select value={formData.type} onValueChange={(value: EventType) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hearing">🔴 Hearing</SelectItem>
                    <SelectItem value="filing">🟢 Filing</SelectItem>
                    <SelectItem value="meeting">🟡 Meeting</SelectItem>
                    <SelectItem value="misc">🔵 Miscellaneous</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reminder">Reminder</Label>
                <Select value={formData.reminder} onValueChange={(value: ReminderType) => setFormData(prev => ({ ...prev, reminder: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10min">10 minutes before</SelectItem>
                    <SelectItem value="1hour">1 hour before</SelectItem>
                    <SelectItem value="1day">1 day before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Notes / Instructions</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes or instructions..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>
                {editingEvent ? 'Update Event' : 'Add Event'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Calendar View
                {selectedDate && (
                  <span className="text-sm font-normal text-gray-600">
                    Selected: {format(selectedDate, 'PPP')}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleCalendarDateSelect}
                className="rounded-md border pointer-events-auto"
                modifiers={{
                  hasEvents: (date) => hasEventsOnDate(date),
                  today: (date) => isToday(date)
                }}
                modifiersStyles={{
                  hasEvents: { 
                    backgroundColor: '#dbeafe', 
                    color: '#1e40af',
                    fontWeight: 'bold',
                    border: '2px solid #3b82f6'
                  },
                  today: {
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    fontWeight: 'bold'
                  }
                }}
                components={{
                  IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                  IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
                }}
              />
              
              {selectedDate && getEventsForSelectedDate().length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Events on {format(selectedDate, 'PPP')}</h4>
                  {getEventsForSelectedDate().map(event => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span>{eventTypeIcons[event.type]}</span>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-600">{event.time} - {event.court}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => exportToGoogleCalendar(event)}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedDate && getEventsForSelectedDate().length === 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-500">No events scheduled for {format(selectedDate, 'PPP')}</p>
                  <Button
                    onClick={handleAddEventClick}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Event for This Date
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No upcoming events</p>
              ) : (
                upcomingEvents.map(event => (
                  <div key={event.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={eventTypeColors[event.type]}>
                            {eventTypeIcons[event.type]} {event.type}
                          </Badge>
                          {isToday(event.date) && (
                            <Badge variant="outline" className="text-xs">Today</Badge>
                          )}
                          {isTomorrow(event.date) && (
                            <Badge variant="outline" className="text-xs">Tomorrow</Badge>
                          )}
                        </div>
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {event.clientName}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.court || 'No venue specified'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(event.date, 'MMM dd, yyyy')} at {event.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => exportToGoogleCalendar(event)}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HearingTracker;
