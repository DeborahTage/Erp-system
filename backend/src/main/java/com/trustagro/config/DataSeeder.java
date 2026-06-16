package com.trustagro.config;

import com.trustagro.masterdata.entity.MasterDataCategory;
import com.trustagro.masterdata.entity.MasterDataItem;
import com.trustagro.masterdata.repository.MasterDataItemRepository;
import com.trustagro.user.entity.Role;
import com.trustagro.user.entity.User;
import com.trustagro.user.entity.UserStatus;
import com.trustagro.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MasterDataItemRepository masterDataRepository;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder, MasterDataItemRepository masterDataRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.masterDataRepository = masterDataRepository;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@trustagro.com")) {
            User admin = new User();
            admin.setFullName("System Administrator");
            admin.setEmail("admin@trustagro.com");
            admin.setPhone("+233000000000");
            admin.setPassword(passwordEncoder.encode("Admin@1234"));
            admin.setRole(Role.ADMIN);
            admin.setStatus(UserStatus.ACTIVE);
            userRepository.save(admin);
            log.info("Default admin user created: admin@trustagro.com / Admin@1234");
        }

        seedMasterData();
    }

    private void seedMasterData() {
        // Breeds
        seedMDM(MasterDataCategory.BREED, "COBB_500", "Cobb 500", "Broiler breed", 1);
        seedMDM(MasterDataCategory.BREED, "ROSS_308", "Ross 308", "Broiler breed", 2);
        seedMDM(MasterDataCategory.BREED, "ISA_BROWN", "ISA Brown", "Layer breed", 3);
        seedMDM(MasterDataCategory.BREED, "LOHMANN_BROWN", "Lohmann Brown", "Layer breed", 4);

        // Drug Types
        seedMDM(MasterDataCategory.DRUG_TYPE, "ANTIBIOTIC", "Antibiotic", "Bacterial infections", 1);
        seedMDM(MasterDataCategory.DRUG_TYPE, "VACCINE", "Vaccine", "Preventative immunization", 2);
        seedMDM(MasterDataCategory.DRUG_TYPE, "VITAMIN", "Vitamin Supplement", "Nutritional supplement", 3);
        seedMDM(MasterDataCategory.DRUG_TYPE, "ANTHELMINTIC", "Dewormer", "Internal parasites", 4);

        // Feed Types
        seedMDM(MasterDataCategory.FEED_TYPE, "STARTER", "Starter Feed", "0-4 weeks", 1);
        seedMDM(MasterDataCategory.FEED_TYPE, "GROWER", "Grower Feed", "4-8 weeks", 2);
        seedMDM(MasterDataCategory.FEED_TYPE, "FINISHER", "Finisher Feed", "8+ weeks", 3);
        seedMDM(MasterDataCategory.FEED_TYPE, "LAYER_MASH", "Layer Mash", "Laying phase", 4);

        // Disease Types
        seedMDM(MasterDataCategory.DISEASE_TYPE, "VIRAL", "Viral", "Viral diseases", 1);
        seedMDM(MasterDataCategory.DISEASE_TYPE, "BACTERIAL", "Bacterial", "Bacterial diseases", 2);
        seedMDM(MasterDataCategory.DISEASE_TYPE, "FUNGAL", "Fungal", "Fungal diseases", 3);
        seedMDM(MasterDataCategory.DISEASE_TYPE, "PARASITIC", "Parasitic", "Parasitic diseases", 4);

        // Flock Purposes
        seedMDM(MasterDataCategory.FLOCK_PURPOSE, "MEAT", "Meat Production", "Broilers", 1);
        seedMDM(MasterDataCategory.FLOCK_PURPOSE, "EGGS", "Egg Production", "Layers", 2);
        seedMDM(MasterDataCategory.FLOCK_PURPOSE, "BREEDING", "Breeding", "Parent stock", 3);
    }

    private void seedMDM(MasterDataCategory category, String value, String label, String description, int sortOrder) {
        if (!masterDataRepository.existsByCategoryAndValue(category, value)) {
            MasterDataItem item = new MasterDataItem();
            item.setCategory(category);
            item.setValue(value);
            item.setLabel(label);
            item.setDescription(description);
            item.setSortOrder(sortOrder);
            item.setActive(true);
            masterDataRepository.save(item);
        }
    }
}
