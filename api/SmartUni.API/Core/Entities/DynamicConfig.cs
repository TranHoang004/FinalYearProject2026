using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartUni.API.Core.Entities
{
    [Table("DynamicConfigs", Schema = "system")]
    public class DynamicConfig
    {
        [Key]
        public string ConfigKey { get; set; } = string.Empty; // VD: GRADE_SCALE
        public string ConfigValue { get; set; } = string.Empty; // JSON String
        public string? Description { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}