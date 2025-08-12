import { useState, useEffect } from "react";
import { User, UsersResponse, CreateUserData } from "@/types/user";
import { api } from "@/lib/api";
import { UserTable } from "@/components/UserTable";
import { UserForm } from "@/components/UserForm";
import { UserDetail } from "@/components/UserDetail";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { downloadBlob } from "@/lib/utils";
import { 
  Plus, 
  Users, 
  Download, 
  FileText, 
  Search,
  RefreshCw,
  Loader2
} from "lucide-react";

type ViewMode = "list" | "create" | "edit" | "detail";

const Index = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
    totalUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const loadUsers = async (page: number = 1, pageSize: number = 10) => {
    setIsLoading(true);
    try {
      const response = await api.getUsers(page, pageSize);
      setUsers(response.users);
      setPagination({
        pageNumber: response.pageNumber,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
        totalUsers: response.totalUsers,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar usuários. Verifique se a API está rodando em localhost:5000",
        variant: "destructive",
      });
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handlePageChange = (page: number) => {
    loadUsers(page, pagination.pageSize);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewMode("detail");
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setViewMode("edit");
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.deleteUser(userId);
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso!",
        variant: "default",
      });
      await loadUsers(pagination.pageNumber, pagination.pageSize);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao excluir usuário",
        variant: "destructive",
      });
      console.error("Error deleting user:", error);
    }
  };

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      await api.createUser(userData);
      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso!",
        variant: "default",
      });
      setViewMode("list");
      await loadUsers(pagination.pageNumber, pagination.pageSize);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar usuário",
        variant: "destructive",
      });
      console.error("Error creating user:", error);
    }
  };

  const handleUpdateUser = async (userData: CreateUserData) => {
    if (!selectedUser) return;
    
    try {
      console.log("Atualizando usuário...");
      await api.updateUser(selectedUser.id, userData);
      
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso!",
        variant: "default",
      });
      setViewMode("list");
      setSelectedUser(null);
      await loadUsers(pagination.pageNumber, pagination.pageSize);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar usuário",
        variant: "destructive",
      });
      console.error("Error updating user:", error);
    }
  };

  const handleGenerateUsers = async () => {
    setIsLoading(true);
    try {
      await api.generateUsers();
      toast({
        title: "Sucesso",
        description: "Usuários gerados automaticamente!",
        variant: "default",
      });
      await loadUsers(pagination.pageNumber, pagination.pageSize);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao gerar usuários",
        variant: "destructive",
      });
      console.error("Error generating users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await api.exportCSV();
      downloadBlob(blob, "users-report.csv");
      toast({
        title: "Sucesso",
        description: "Relatório CSV baixado com sucesso!",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao exportar CSV",
        variant: "destructive",
      });
      console.error("Error exporting CSV:", error);
    }
  };

  const handleExportPDF = async () => {
    try {
      const blob = await api.exportPDF();
      downloadBlob(blob, "users-report.pdf");
      toast({
        title: "Sucesso",
        description: "Relatório PDF baixado com sucesso!",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao exportar PDF",
        variant: "destructive",
      });
      console.error("Error exporting PDF:", error);
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName} ${user.email} ${user.city} ${user.country}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (viewMode === "create") {
    return (
      <div className="min-h-screen bg-background p-4">
        <UserForm
          onSubmit={handleCreateUser}
          onCancel={() => setViewMode("list")}
          isLoading={isLoading}
        />
      </div>
    );
  }

  if (viewMode === "edit" && selectedUser) {
    return (
      <div className="min-h-screen bg-background p-4">
        <UserForm
          user={selectedUser}
          onSubmit={handleUpdateUser}
          onCancel={() => {
            setViewMode("list");
            setSelectedUser(null);
          }}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-[var(--shadow-card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-r from-primary to-primary-hover rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Gerenciamento de Usuários
                </h1>
                <p className="text-muted-foreground">
                  Sistema CRUD para gerenciar usuários
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setViewMode("create")}
              className="bg-gradient-to-r from-primary to-primary-hover"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
            
            <Button
              variant="outline"
              onClick={handleGenerateUsers}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Gerar Usuários
            </Button>
            
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            
            <Button variant="outline" onClick={handleExportPDF}>
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <div className="space-y-4">
          <UserTable
            users={filteredUsers}
            onView={handleViewUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            isLoading={isLoading}
          />

          {/* Pagination */}
          {!isLoading && users.length > 0 && (
            <Pagination
              currentPage={pagination.pageNumber}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalUsers}
              pageSize={pagination.pageSize}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </main>

      {/* User Detail Modal */}
      {viewMode === "detail" && selectedUser && (
        <UserDetail
          user={selectedUser}
          onClose={() => {
            setViewMode("list");
            setSelectedUser(null);
          }}
          onEdit={handleEditUser}
        />
      )}
    </div>
  );
};

export default Index;
