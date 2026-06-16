package com.trustagro.config;

import com.trustagro.user.entity.RoleEntity;
import com.trustagro.user.repository.RoleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * Seeds the roles table with the enterprise permission matrix on first startup.
 * Existing roles are updated with latest permissions.
 */
@Component
public class RoleSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(RoleSeeder.class);

    private final RoleRepository roleRepository;

    public RoleSeeder(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    private static final Map<String, List<String>> ROLE_PERMISSIONS = Map.of(
        "ADMIN", List.of("*"),
        "GENERAL_MANAGER", List.of(
            "farms:read","flocks:read","daily_records:read","inventory:read","veterinary:read",
            "pharmacy_sales:read","finance:read","revenue:read","costs:read","invoices:read",
            "payroll:read","reports:read","reports:export","users:read","settings:read","audit:read"
        ),
        "OPERATIONS_MANAGER", List.of(
            "farms:read","farms:manage","flocks:read","daily_records:read","daily_records:approve",
            "inventory:read","veterinary:read","reports:read","users:read","notifications:read"
        ),
        "FARM_MANAGER", List.of(
            "farms:read","flocks:read","flocks:write","daily_records:read","daily_records:write",
            "daily_records:approve","inventory:read","veterinary:read","biosecurity:read",
            "reports:read","notifications:read"
        ),
        "VETERINARY_OFFICER", List.of(
            "farms:read","flocks:read","daily_records:read","veterinary:read","veterinary:write",
            "disease_cases:read","disease_cases:write","vaccinations:read","vaccinations:write",
            "vaccinations:administer","prescriptions:read","prescriptions:write","treatments:read",
            "treatments:write","biosecurity:read","biosecurity:write","inventory:read",
            "reports:read","notifications:read"
        ),
        "STORE_KEEPER", List.of(
            "inventory:read","inventory:write","stock_in:write","stock_out:write",
            "suppliers:read","suppliers:write","reports:read","notifications:read"
        ),
        "PHARMACY_SALES", List.of(
            "pharmacy_sales:read","pharmacy_sales:write","inventory:read","notifications:read"
        ),
        "FINANCE_OFFICER", List.of(
            "finance:read","finance:write","revenue:read","revenue:write","costs:read","costs:write",
            "invoices:read","invoices:write","payroll:read","payroll:write","reports:read",
            "reports:export","inventory:read","notifications:read"
        ),
        "EXTENSION_WORKER", List.of(
            "daily_records:write","flocks:read","notifications:read"
        )
    );

    @Override
    public void run(String... args) {
        log.info("Seeding role permissions...");
        ROLE_PERMISSIONS.forEach((roleName, permissions) -> {
            RoleEntity role = roleRepository.findByName(roleName)
                    .orElseGet(() -> {
                        RoleEntity r = new RoleEntity();
                        r.setName(roleName);
                        return r;
                    });
            role.setPermissions(permissions);
            roleRepository.save(role);
            log.info("Seeded role: {} with {} permissions", roleName, permissions.size());
        });
    }
}
