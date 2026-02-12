package com.bankapp.api.entities;


import com.bankapp.api.entities.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
@Data
@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String fullName;
    
    @Column(nullable = false)
    private boolean active = true;

    public Employee() {}

    public Employee(String username,
                    String password,
                    Role role,
                    String fullName) {

        this.username = username;
        this.password = password;
        this.role = role;
        this.fullName = fullName;
    }

    
}