package com.trustagro.user.dto;

import com.trustagro.user.entity.Role;
import com.trustagro.user.entity.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRequest {
    @NotBlank
    @Size(max = 100)
    private String fullName;
    @NotBlank @Email @Size(max = 120)
    private String email;
    @Pattern(regexp = "^(\\+?[0-9 .()-]{7,20})?$", message = "Phone number format is invalid")
    private String phone;
    @Size(min = 8, max = 72)
    private String password;
    @NotNull
    private Role role;
}
