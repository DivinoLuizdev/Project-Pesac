using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RandomUserApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Gender = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Title = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    FirstName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    StreetNumber = table.Column<int>(type: "integer", nullable: true),
                    StreetName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    City = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    State = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Country = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Postcode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Latitude = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Longitude = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    TimezoneOffset = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    TimezoneDescription = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    LoginUuid = table.Column<Guid>(type: "uuid", nullable: true),
                    Username = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Password = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Salt = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Md5 = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Sha1 = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Sha256 = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    DobDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DobAge = table.Column<int>(type: "integer", nullable: true),
                    RegisteredDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RegisteredAge = table.Column<int>(type: "integer", nullable: true),
                    Phone = table.Column<string>(type: "text", nullable: false),
                    Cell = table.Column<string>(type: "text", nullable: false),
                    IdName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IdValue = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    PictureLarge = table.Column<string>(type: "text", nullable: false),
                    PictureMedium = table.Column<string>(type: "text", nullable: false),
                    PictureThumbnail = table.Column<string>(type: "text", nullable: false),
                    Nationality = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
