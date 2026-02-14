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

    @Column(nullable = false, updatable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String emailId;

    @Column(unique = true, nullable = false, length = 10)
    private String phoneNumber;

    @Column(unique = true, nullable = false, length = 12, updatable = false)
    private String aadhaarNumber;
    
    @Column(nullable = false)
    private boolean active = true;

    public Employee() {}

    public Employee(String username,
                    String password,
                    Role role,
                    String fullName,
                    String emailId,
                    String phoneNumber,
                    String aadhaarNumber) {

        this.username = username;
        this.password = password;
        this.role = role;
        this.fullName = fullName;
        this.emailId = emailId;
        this.phoneNumber = phoneNumber;
        this.aadhaarNumber = aadhaarNumber;
    }

    
}
