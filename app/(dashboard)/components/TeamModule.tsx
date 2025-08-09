import React, { useState, useEffect } from 'react';
import { Plus, Send, Paperclip, Users, MessageCircle } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase/client';

interface TeamModuleProps {
  projectId: string;
}

const TeamModule: React.FC<TeamModuleProps> = ({ projectId }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const s = supabaseBrowser();

  useEffect(() => {
    loadTeamData();
  }, [projectId]);

  const loadTeamData = async () => {
    setIsLoading(true);
    try {
      // TODO: Load team members for this project
      // TODO: Load chat rooms for this project
      // TODO: Set default selected room
      
      // Mock data structure for now
      setTeamMembers([]);
      setChatRooms([]);
      setMessages([]);
    } catch (error) {
      console.error('Error loading team data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedRoom) return;
    
    // TODO: Send message to database
    const message = {
      id: Date.now(),
      sender: 'You',
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      room_id: selectedRoom.id
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[600px]">
            <div className="p-6 border-b border-gray-100">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex-1 p-6">
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Team Collaboration</h2>
          <p className="text-gray-600">Communicate with your project team</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <Plus size={20} />
          Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members & Chat Rooms */}
        <div className="lg:col-span-1 space-y-6">
          {/* Team Members */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Team Members</h3>
            
            {teamMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm mb-3">No team members yet</p>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  Invite team members
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* TODO: Render team members */}
              </div>
            )}
          </div>

          {/* Chat Rooms */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Chat Rooms</h3>
            
            {chatRooms.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm mb-3">No chat rooms available</p>
                <p className="text-xs text-gray-400">Chat rooms are created automatically when team members are added to projects</p>
              </div>
            ) : (
              <div className="space-y-2">
                {/* TODO: Render chat rooms */}
              </div>
            )}
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No recent activity</p>
              <p className="text-xs text-gray-400 mt-1">Team activity will appear here</p>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Project Chat</h3>
                  <p className="text-sm text-gray-600">
                    {selectedRoom ? selectedRoom.name : 'Select a chat room'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
              {!selectedRoom ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Team Chat</h3>
                    <p className="text-gray-500 mb-4">Invite team members to start collaborating on your project.</p>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                      Invite Team Members
                    </button>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-gray-500">No messages yet</p>
                    <p className="text-sm text-gray-400 mt-1">Start the conversation!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map(message => (
                    <div key={message.id} className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {message.sender.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{message.sender}</span>
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                        <p className="text-gray-700">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={selectedRoom ? "Type a message... Use @name to mention someone" : "Select a chat room to send messages"}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={!selectedRoom}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newMessage.trim()) {
                      sendMessage();
                    }
                  }}
                />
                <button 
                  disabled={!selectedRoom}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <Paperclip size={20} />
                </button>
                <button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || !selectedRoom}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamModule;