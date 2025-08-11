import { User } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatFullName } from "@/lib/utils";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  User as UserIcon, 
  CreditCard,
  X
} from "lucide-react";

interface UserDetailProps {
  user: User;
  onClose: () => void;
  onEdit: (user: User) => void;
}

export function UserDetail({ user, onClose, onEdit }: UserDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto shadow-[var(--shadow-elegant)]">
        <CardHeader className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 text-primary-foreground hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-white/20">
              <AvatarImage 
                src={user.pictureLarge || user.pictureThumbnail} 
                alt={formatFullName(user.title, user.firstName, user.lastName)} 
              />
              <AvatarFallback className="text-2xl bg-white/20">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl mb-2">
                {formatFullName(user.title, user.firstName, user.lastName)}
              </CardTitle>
              <p className="text-lg opacity-90">@{user.username}</p>
              <Badge variant="secondary" className="mt-2 bg-white/20 text-primary-foreground">
                {user.nationality}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contato
              </h3>
              <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.cell} (Celular)</span>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                Dados Pessoais
              </h3>
              <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(user.dobDate)} ({user.dobAge} anos)</span>
                </div>
                <div className="flex items-center gap-3">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{user.gender === 'male' ? 'Masculino' : 'Feminino'}</span>
                </div>
                {user.registeredDate && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Cadastrado em {formatDate(user.registeredDate)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Endereço
              </h3>
              <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                <div>
                  <p className="font-medium">{user.streetNumber} {user.streetName}</p>
                  <p className="text-muted-foreground">{user.city}, {user.state}</p>
                  <p className="text-muted-foreground">{user.country} - {user.postcode}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Coordenadas: {user.latitude}, {user.longitude}</p>
                  <p>Fuso horário: {user.timezoneOffset} ({user.timezoneDescription})</p>
                </div>
              </div>
            </div>

            {/* ID Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Documentos
              </h3>
              <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>{user.idName}: {user.idValue}</span>
                </div>
                {user.loginUuid && (
                  <div className="text-sm text-muted-foreground">
                    <p>Login UUID: {user.loginUuid}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button 
              onClick={() => onEdit(user)}
              className="bg-gradient-to-r from-primary to-primary-hover"
            >
              Editar Usuário
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}