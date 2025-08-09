import React, { useState, useEffect } from 'react';
import { Plus, FileText, Download, Share, User, Eye } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase/client';

interface Contract {
  id: string;
  title: string;
  type: string;
  status: string;
  signers: string[];
  created_at: string;
}

interface ContractsModuleProps {
  projectId: string;
}

const ContractsModule: React.FC<ContractsModuleProps> = ({ projectId }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const s = supabaseBrowser();

  useEffect(() => {
    loadContracts();
  }, [projectId]);

  const loadContracts = async () => {
    setIsLoading(true);
    try {
      // TODO: Load contracts from database
      // const { data, error } = await s
      //   .from('contracts')
      //   .select('*')
      //   .eq('project_id', projectId)
      //   .order('created_at', { ascending: false });

      // if (error) throw error;
      // setContracts(data || []);
      
      // Mock empty state for now
      setContracts([]);
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const contractTemplates = [
    {
      name: 'Split Sheet Generator',
      description: 'Generate songwriter and producer split agreements',
      icon: '📄'
    },
    {
      name: 'Producer Agreement',
      description: 'Standard producer contract template',
      icon: '🎛️'
    },
    {
      name: 'Feature Artist Contract',
      description: 'Agreement for featured artists',
      icon: '🎤'
    },
    {
      name: 'Publishing Deal',
      description: 'Music publishing agreement template',
      icon: '📋'
    },
    {
      name: 'Master Recording Agreement',
      description: 'Rights and ownership of master recordings',
      icon: '🎵'
    },
    {
      name: 'Beat License Agreement',
      description: 'License agreement for beat usage',
      icon: '🥁'
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Contracts & Agreements</h2>
          <p className="text-gray-600">Manage split sheets and music agreements</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <Plus size={20} />
          New Contract
        </button>
      </div>

      {/* Existing Contracts */}
      {contracts.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Contracts</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {contracts.map(contract => (
              <div key={contract.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                      <FileText size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{contract.title}</h4>
                      <p className="text-sm text-gray-500 capitalize">{contract.type.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    contract.status === 'signed' ? 'bg-green-100 text-green-800' : 
                    contract.status === 'pending' ? 'bg-orange-100 text-orange-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Signers:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {contract.signers.map((signer, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                          <User size={12} className="mr-1" />
                          {signer}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium text-sm">
                    <Eye size={14} />
                    View Contract
                  </button>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Download size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Share size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Contract Assistant */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">AI Contract Assistant</h3>
        <p className="text-gray-600 mb-6">Generate customized music contracts with AI assistance</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contractTemplates.map((template) => (
            <button 
              key={template.name}
              className="bg-white border border-purple-200 rounded-lg p-4 text-left hover:bg-purple-50 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{template.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-purple-700">
                    {template.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {contracts.length === 0 && (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Contracts Yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start by generating contracts for your project using our AI assistant or create custom agreements.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
              Generate Contract
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
              Upload Existing
            </button>
          </div>
        </div>
      )}

      {/* Contract Education */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-2">📚 Contract Resources</h3>
        <p className="text-gray-600 mb-4">Learn about music industry contracts and best practices</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="#" className="block p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
            <h4 className="font-medium text-gray-900">Split Sheet Basics</h4>
            <p className="text-sm text-gray-600 mt-1">Understanding songwriter credits and royalties</p>
          </a>
          <a href="#" className="block p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
            <h4 className="font-medium text-gray-900">Producer Agreements</h4>
            <p className="text-sm text-gray-600 mt-1">Key terms and negotiation points</p>
          </a>
          <a href="#" className="block p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
            <h4 className="font-medium text-gray-900">Publishing Rights</h4>
            <p className="text-sm text-gray-600 mt-1">Protecting your intellectual property</p>
          </a>
          <a href="#" className="block p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
            <h4 className="font-medium text-gray-900">Legal Review</h4>
            <p className="text-sm text-gray-600 mt-1">When to consult an entertainment lawyer</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContractsModule;