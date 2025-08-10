using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using RandomUserApi.Models;

namespace RandomUserApi.Services
{
    public class RandomUserService
    {
        private readonly HttpClient _httpClient;

        public RandomUserService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<User> GetRandomUserAsync()
        {
            var response = await _httpClient.GetAsync("https://randomuser.me/api/");
            response.EnsureSuccessStatusCode();

            using var stream = await response.Content.ReadAsStreamAsync();

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var apiResponse = await JsonSerializer.DeserializeAsync<RandomUserApiResponse>(stream, options);

            if (apiResponse?.Results == null || apiResponse.Results.Length == 0)
            {
                throw new Exception("No user data returned from API.");
            }

            var result = apiResponse.Results[0];

            // O resto do mapeamento fica igual

            return new User
            {
                Id = Guid.NewGuid(),

                Gender = result.Gender ?? string.Empty,

                Title = result.Name?.Title ?? string.Empty,
                FirstName = result.Name?.First ?? string.Empty,
                LastName = result.Name?.Last ?? string.Empty,

                StreetNumber = result.Location?.Street?.Number ?? 0,
                StreetName = result.Location?.Street?.Name ?? string.Empty,
                City = result.Location?.City ?? string.Empty,
                State = result.Location?.State ?? string.Empty,
                Country = result.Location?.Country ?? string.Empty,
                Postcode = result.Location?.Postcode?.ToString() ?? string.Empty,

                Latitude = result.Location?.Coordinates?.Latitude ?? string.Empty,
                Longitude = result.Location?.Coordinates?.Longitude ?? string.Empty,

                TimezoneOffset = result.Location?.Timezone?.Offset ?? string.Empty,
                TimezoneDescription = result.Location?.Timezone?.Description ?? string.Empty,

                Email = result.Email ?? string.Empty,

                LoginUuid = Guid.TryParse(result.Login?.Uuid, out var guid) ? guid : Guid.NewGuid(),
                Username = result.Login?.Username ?? string.Empty,
                Password = result.Login?.Password ?? string.Empty,
                Salt = result.Login?.Salt ?? string.Empty,
                Md5 = result.Login?.Md5 ?? string.Empty,
                Sha1 = result.Login?.Sha1 ?? string.Empty,
                Sha256 = result.Login?.Sha256 ?? string.Empty,

                DobDate = result.Dob?.Date ?? DateTime.MinValue,
                DobAge = result.Dob?.Age ?? 0,

                RegisteredDate = result.Registered?.Date ?? DateTime.MinValue,
                RegisteredAge = result.Registered?.Age ?? 0,

                Phone = result.Phone ?? string.Empty,
                Cell = result.Cell ?? string.Empty,

                IdName = result.Id?.Name ?? string.Empty,
                IdValue = result.Id?.Value ?? string.Empty,

                PictureLarge = result.Picture?.Large ?? string.Empty,
                PictureMedium = result.Picture?.Medium ?? string.Empty,
                PictureThumbnail = result.Picture?.Thumbnail ?? string.Empty,

                Nationality = result.Nat ?? string.Empty,
            };
        }

        private class RandomUserApiResponse
        {
            public Result[] Results { get; set; } = Array.Empty<Result>();
        }

        private class Result
        {
            public string? Gender { get; set; }
            public Name? Name { get; set; }
            public Location? Location { get; set; }
            public string? Email { get; set; }
            public Login? Login { get; set; }
            public Dob? Dob { get; set; }
            public Registered? Registered { get; set; }
            public string? Phone { get; set; }
            public string? Cell { get; set; }
            public Id? Id { get; set; }
            public Picture? Picture { get; set; }
            public string? Nat { get; set; }
        }

        private class Name
        {
            public string? Title { get; set; }
            public string? First { get; set; }
            public string? Last { get; set; }
        }

        private class Location
        {
            public Street? Street { get; set; }
            public string? City { get; set; }
            public string? State { get; set; }
            public string? Country { get; set; }
            public object? Postcode { get; set; }
            public Coordinates? Coordinates { get; set; }
            public Timezone? Timezone { get; set; }
        }

        private class Street
        {
            public int? Number { get; set; }
            public string? Name { get; set; }
        }

        private class Coordinates
        {
            public string? Latitude { get; set; }
            public string? Longitude { get; set; }
        }

        private class Timezone
        {
            public string? Offset { get; set; }
            public string? Description { get; set; }
        }

        private class Login
        {
            public string? Uuid { get; set; }
            public string? Username { get; set; }
            public string? Password { get; set; }
            public string? Salt { get; set; }
            public string? Md5 { get; set; }
            public string? Sha1 { get; set; }
            public string? Sha256 { get; set; }
        }

        private class Dob
        {
            public DateTime? Date { get; set; }
            public int? Age { get; set; }
        }

        private class Registered
        {
            public DateTime? Date { get; set; }
            public int? Age { get; set; }
        }

        private class Id
        {
            public string? Name { get; set; }
            public string? Value { get; set; }
        }

        private class Picture
        {
            public string? Large { get; set; }
            public string? Medium { get; set; }
            public string? Thumbnail { get; set; }
        }
    }
}
