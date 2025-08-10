using System;
using System.ComponentModel.DataAnnotations;

namespace RandomUserApi.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "O gênero é obrigatório.")]
        [StringLength(20, ErrorMessage = "O gênero pode ter no máximo 20 caracteres.")]
        public string Gender { get; set; } = string.Empty;

        [StringLength(20, ErrorMessage = "O título pode ter no máximo 20 caracteres.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "O primeiro nome é obrigatório.")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "O primeiro nome deve ter entre 2 e 50 caracteres.")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "O sobrenome é obrigatório.")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "O sobrenome deve ter entre 2 e 50 caracteres.")]
        public string LastName { get; set; } = string.Empty;

        public int? StreetNumber { get; set; }

        [StringLength(100, ErrorMessage = "O nome da rua pode ter no máximo 100 caracteres.")]
        public string StreetName { get; set; } = string.Empty;

        [StringLength(50, ErrorMessage = "A cidade pode ter no máximo 50 caracteres.")]
        public string City { get; set; } = string.Empty;

        [StringLength(50, ErrorMessage = "O estado pode ter no máximo 50 caracteres.")]
        public string State { get; set; } = string.Empty;

        [StringLength(50, ErrorMessage = "O país pode ter no máximo 50 caracteres.")]
        public string Country { get; set; } = string.Empty;

        [StringLength(20, ErrorMessage = "O código postal pode ter no máximo 20 caracteres.")]
        public string Postcode { get; set; } = string.Empty;

        [StringLength(50)]
        public string Latitude { get; set; } = string.Empty;

        [StringLength(50)]
        public string Longitude { get; set; } = string.Empty;

        [StringLength(10)]
        public string TimezoneOffset { get; set; } = string.Empty;

        [StringLength(100)]
        public string TimezoneDescription { get; set; } = string.Empty;

        [Required(ErrorMessage = "O email é obrigatório.")]
        [EmailAddress(ErrorMessage = "Formato de e-mail inválido.")]
        public string Email { get; set; } = string.Empty;

        public Guid? LoginUuid { get; set; }

        [Required(ErrorMessage = "O nome de usuário é obrigatório.")]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "A senha é obrigatória.")]
        [StringLength(100)]
        public string Password { get; set; } = string.Empty;

        [StringLength(50)]
        public string Salt { get; set; } = string.Empty;

        [StringLength(32)]
        public string Md5 { get; set; } = string.Empty;

        [StringLength(40)]
        public string Sha1 { get; set; } = string.Empty;

        [StringLength(64)]
        public string Sha256 { get; set; } = string.Empty;

        public DateTime? DobDate { get; set; }

        [Range(0, 150)]
        public int? DobAge { get; set; }

        public DateTime? RegisteredDate { get; set; }

        [Range(0, 150)]
        public int? RegisteredAge { get; set; }

        [Phone(ErrorMessage = "Formato de telefone inválido.")]
        public string Phone { get; set; } = string.Empty;

        [Phone(ErrorMessage = "Formato de celular inválido.")]
        public string Cell { get; set; } = string.Empty;

        [StringLength(50)]
        public string IdName { get; set; } = string.Empty;

        [StringLength(50)]
        public string IdValue { get; set; } = string.Empty;

        [Url(ErrorMessage = "URL inválida.")]
        public string PictureLarge { get; set; } = string.Empty;

        [Url(ErrorMessage = "URL inválida.")]
        public string PictureMedium { get; set; } = string.Empty;

        [Url(ErrorMessage = "URL inválida.")]
        public string PictureThumbnail { get; set; } = string.Empty;

        [StringLength(5)]
        public string Nationality { get; set; } = string.Empty;
    }
}
