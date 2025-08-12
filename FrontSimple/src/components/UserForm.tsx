import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, CreateUserData } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateUUID, generateHashes, getUserLocationData, calculateAge } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const userSchema = z.object({
  gender: z.enum(["male", "female"]),
  title: z.string().min(1, "Título é obrigatório"),
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  streetNumber: z.string().transform(Number),
  streetName: z.string().min(1, "Nome da rua é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  country: z.string().min(1, "País é obrigatório"),
  postcode: z.string().min(1, "CEP é obrigatório"),
  email: z.string().email("Email inválido"),
  username: z.string().min(3, "Username deve ter pelo menos 3 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional(),
  phone: z.string().min(1, "Telefone é obrigatório"),
  cell: z.string().min(1, "Celular é obrigatório"),
  idName: z.string().min(1, "Tipo de documento é obrigatório"),
  idValue: z.string().min(1, "Número do documento é obrigatório"),
  dobDate: z.string().min(1, "Data de nascimento é obrigatória"),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: User;
  onSubmit: (userData: CreateUserData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UserForm({ user, onSubmit, onCancel, isLoading }: UserFormProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user ? {
      gender: user.gender,
      title: user.title,
      firstName: user.firstName,
      lastName: user.lastName,
      streetNumber: user.streetNumber,
      streetName: user.streetName,
      city: user.city,
      state: user.state,
      country: user.country,
      postcode: user.postcode,
      email: user.email,
      username: user.username,
      phone: user.phone,
      cell: user.cell,
      idName: user.idName,
      idValue: user.idValue,
      dobDate: user.dobDate.split('T')[0], // Format for date input
    } : {},
  });

  useEffect(() => {
    if (!isEditing) {
      // Auto-fill location data for new users
      const getLocationData = async () => {
        setIsGettingLocation(true);
        try {
          const locationData = await getUserLocationData();
          // Location data will be used in form submission
        } catch (error) {
          console.error("Failed to get location data:", error);
        } finally {
          setIsGettingLocation(false);
        }
      };
      getLocationData();
    }
  }, [isEditing]);

  const onSubmitForm = async (data: UserFormData) => {
    try {
      const locationData = await getUserLocationData();
      const hashes = data.password ? generateHashes(data.password) : {};
      
      const userData: CreateUserData = {
        id: isEditing ? user.id : generateUUID(),
        gender: data.gender,
        title: data.title,
        firstName: data.firstName,
        lastName: data.lastName,
        streetNumber: Number(data.streetNumber),
        streetName: data.streetName,
        city: data.city,
        state: data.state,
        country: data.country,
        postcode: data.postcode,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        timezoneOffset: locationData.timezoneOffset,
        timezoneDescription: locationData.timezoneDescription,
        email: data.email,
        loginUuid: isEditing ? user.loginUuid : generateUUID(),
        username: data.username,
        ...(data.password && {
          password: data.password,
          ...hashes,
        }),
        dobDate: new Date(data.dobDate).toISOString(),
        dobAge: calculateAge(data.dobDate),
        registeredDate: isEditing ? user.registeredDate : new Date().toISOString(),
        registeredAge: isEditing ? user.registeredAge : 0,
        phone: data.phone,
        cell: data.cell,
        idName: data.idName,
        idValue: data.idValue,
        pictureLarge: user?.pictureLarge || "https://randomuser.me/api/portraits/men/1.jpg",
        pictureMedium: user?.pictureMedium || "https://randomuser.me/api/portraits/med/men/1.jpg",
        pictureThumbnail: user?.pictureThumbnail || "https://randomuser.me/api/portraits/thumb/men/1.jpg",
        nationality: user?.nationality || "BR",
      };

      await onSubmit(userData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const titleOptions = ["Mr", "Mrs", "Ms", "Dr", "Prof"];

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-[var(--shadow-elegant)]">
      <CardHeader className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground">
        <CardTitle className="text-2xl">
          {isEditing ? "Editar Usuário" : "Novo Usuário"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Personal Information */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gênero</Label>
              <Select onValueChange={(value) => setValue("gender", value as "male" | "female")}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Select onValueChange={(value) => setValue("title", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o título" />
                </SelectTrigger>
                <SelectContent>
                  {titleOptions.map((title) => (
                    <SelectItem key={title} value={title}>{title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">Nome</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                placeholder="Digite o nome"
              />
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                placeholder="Digite o sobrenome"
              />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Digite o email"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register("username")}
                placeholder="Digite o username"
              />
              {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
            </div>

            { 
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Digite a senha"
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>
            }

            <div className="space-y-2">
              <Label htmlFor="dobDate">Data de Nascimento</Label>
              <Input
                id="dobDate"
                type="date"
                {...register("dobDate")}
              />
              {errors.dobDate && <p className="text-sm text-destructive">{errors.dobDate.message}</p>}
            </div>

            {/* Address Information */}
            <div className="space-y-2">
              <Label htmlFor="streetNumber">Número</Label>
              <Input
                id="streetNumber"
                 type="number"
                {...register("streetNumber")}
                placeholder="Número da rua"
              />
              {/* {errors.streetNumber && <p className="text-sm text-destructive">{errors.streetNumber.message}</p>} */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="streetName">Rua</Label>
              <Input
                id="streetName"
                {...register("streetName")}
                placeholder="Nome da rua"
              />
              {errors.streetName && <p className="text-sm text-destructive">{errors.streetName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                {...register("city")}
                placeholder="Cidade"
              />
              {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                {...register("state")}
                placeholder="Estado"
              />
              {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                {...register("country")}
                placeholder="País"
              />
              {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postcode">CEP</Label>
              <Input
                id="postcode"
                {...register("postcode")}
                placeholder="CEP"
              />
              {errors.postcode && <p className="text-sm text-destructive">{errors.postcode.message}</p>}
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="Telefone"
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cell">Celular</Label>
              <Input
                id="cell"
                {...register("cell")}
                placeholder="Celular"
              />
              {errors.cell && <p className="text-sm text-destructive">{errors.cell.message}</p>}
            </div>

            {/* ID Information */}
            <div className="space-y-2">
              <Label htmlFor="idName">Tipo de Documento</Label>
              <Input
                id="idName"
                {...register("idName")}
                placeholder="Ex: RG, CPF"
              />
              {errors.idName && <p className="text-sm text-destructive">{errors.idName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="idValue">Número do Documento</Label>
              <Input
                id="idValue"
                {...register("idValue")}
                placeholder="Número do documento"
              />
              {errors.idValue && <p className="text-sm text-destructive">{errors.idValue.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isGettingLocation}
              className="bg-gradient-to-r from-primary to-primary-hover"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Atualizando..." : "Criando..."}
                </>
              ) : (
                isEditing ? "Atualizar Usuário" : "Criar Usuário"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}