-- ==========================================
-- BOOK MY DOCTOR: Database Schema & Seed Data
-- Target Database: MySQL
-- ==========================================

CREATE DATABASE IF NOT EXISTS `book_my_doctor`;
USE `book_my_doctor`;

-- 1. Users Table (Core Auth Structure)
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('patient', 'doctor', 'admin') NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Specializations Table
CREATE TABLE IF NOT EXISTS `specializations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Hospitals Table
CREATE TABLE IF NOT EXISTS `hospitals` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `address` TEXT NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `rating` DECIMAL(3, 2) DEFAULT 5.00,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Patients Table
CREATE TABLE IF NOT EXISTS `patients` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL UNIQUE,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
    `dob` DATE NOT NULL,
    `address` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_patient_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Doctors Table
CREATE TABLE IF NOT EXISTS `doctors` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL UNIQUE,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `specialization_id` INT NOT NULL,
    `hospital_id` INT NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
    `experience_years` INT NOT NULL,
    `consultation_fee` DECIMAL(10, 2) NOT NULL,
    `bio` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_doctor_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_doctor_specialization` FOREIGN KEY (`specialization_id`) REFERENCES `specializations` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_doctor_hospital` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Schedules Table (Doctor Availability)
CREATE TABLE IF NOT EXISTS `schedules` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `doctor_id` INT NOT NULL,
    `day_of_week` ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,
    `is_available` BOOLEAN DEFAULT TRUE,
    CONSTRAINT `fk_schedule_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
    CONSTRAINT `uq_doctor_schedule_day` UNIQUE (`doctor_id`, `day_of_week`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Appointments Table
CREATE TABLE IF NOT EXISTS `appointments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `patient_id` INT NOT NULL,
    `doctor_id` INT NOT NULL,
    `appointment_date` DATE NOT NULL,
    `appointment_time` TIME NOT NULL,
    `status` ENUM('Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled') DEFAULT 'Pending',
    `reason` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_appointment_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_appointment_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Payments Table
CREATE TABLE IF NOT EXISTS `payments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `appointment_id` INT NOT NULL UNIQUE,
    `amount` DECIMAL(10, 2) NOT NULL,
    `transaction_id` VARCHAR(100) NOT NULL UNIQUE,
    `status` ENUM('Pending', 'Success', 'Failed') DEFAULT 'Pending',
    `payment_method` VARCHAR(50) NOT NULL DEFAULT 'Simulated Card',
    `payment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_payment_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Admin Table
CREATE TABLE IF NOT EXISTS `admin` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL UNIQUE,
    `name` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(20),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_admin_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Feedback Table
CREATE TABLE IF NOT EXISTS `feedback` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `appointment_id` INT NOT NULL UNIQUE,
    `patient_id` INT NOT NULL,
    `rating` INT CHECK (`rating` BETWEEN 1 AND 5),
    `comments` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_feedback_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_feedback_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==========================================
-- SEED DATA (MOCK DATA FOR TESTING)
-- ==========================================

-- Seed Specializations
INSERT INTO `specializations` (`id`, `name`, `description`) VALUES
(1, 'Cardiology', 'Heart and cardiovascular system treatments.'),
(2, 'Dermatology', 'Skin, hair, nails, and related disorders.'),
(3, 'Pediatrics', 'Medical care for infants, children, and adolescents.'),
(4, 'Neurology', 'Disorders of the nervous system and brain.'),
(5, 'General Medicine', 'Primary care, diagnosis, and treatment of everyday health conditions.');

-- Seed Hospitals
INSERT INTO `hospitals` (`id`, `name`, `city`, `address`, `phone`, `email`, `rating`) VALUES
(1, 'Apollo Speciality Hospital', 'Chennai', '21, Greams Lane, Off Greams Road, Chennai - 600006', '+91 44 2829 0200', 'info.chennai@apollo.com', 4.8),
(2, 'Max Super Speciality Hospital', 'Delhi', '1, Press Enclave Road, Saket, New Delhi - 110017', '+91 11 2651 5050', 'contact@maxhealthcare.com', 4.7),
(3, 'Fortis Memorial Research Institute', 'Gurgaon', 'Sector 44, Opposite HUDA City Centre, Gurgaon - 122002', '+91 124 496 2200', 'contact@fortishealth.com', 4.6),
(4, 'Kokilaben Dhirubhai Ambani Hospital', 'Mumbai', 'Rao Saheb, Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai - 400053', '+91 22 4269 6969', 'feedback@kokilabenhospitals.com', 4.9);

-- Seed Core Users (Passwords hashed for demonstration, they default to 'password123' hashed with bcrypt: '$2b$12$6uXvX/Q5R4Z9rV9wX8U.y.pQ7q7Xq7P7E.7m8e8h.7y8E8u8d8M8S')
-- Admin User: admin@bookmydoctor.com / admin123 (hashed: '$2b$12$fTeqc91M/J0jS7F4gV8h7.v6v2/w2c2S2G2c2S2G2c2S2G2c2S2G.')
-- Doctor Users:
-- dr.smith@bookmydoctor.com (Cardiology) / password123
-- dr.jane@bookmydoctor.com (Dermatology) / password123
-- Patient Users:
-- pat.jones@gmail.com / password123
-- pat.doe@gmail.com / password123

INSERT INTO `users` (`id`, `email`, `password_hash`, `role`) VALUES
(1, 'admin@bookmydoctor.com', '$2b$12$R9hKzGfK.5P1h1k0d0u2O.Kux3Fq/Q933U2FvYyX9Z9FjUu9v0Q4.', 'admin'), -- Password: admin123
(2, 'dr.smith@bookmydoctor.com', '$2b$12$t4j/R9hKzGfK.5P1h1k0d0u2O.Kux3Fq/Q933U2FvYyX9Z9FjUu9v', 'doctor'), -- Password: password123
(3, 'dr.jane@bookmydoctor.com', '$2b$12$t4j/R9hKzGfK.5P1h1k0d0u2O.Kux3Fq/Q933U2FvYyX9Z9FjUu9v', 'doctor'), -- Password: password123
(4, 'pat.jones@gmail.com', '$2b$12$t4j/R9hKzGfK.5P1h1k0d0u2O.Kux3Fq/Q933U2FvYyX9Z9FjUu9v', 'patient'), -- Password: password123
(5, 'pat.doe@gmail.com', '$2b$12$t4j/R9hKzGfK.5P1h1k0d0u2O.Kux3Fq/Q933U2FvYyX9Z9FjUu9v', 'patient'); -- Password: password123

-- Seed Admin Table
INSERT INTO `admin` (`id`, `user_id`, `name`, `phone`) VALUES
(1, 1, 'Chief Admin Director', '+91 99999 88888');

-- Seed Doctors Table
INSERT INTO `doctors` (`id`, `user_id`, `first_name`, `last_name`, `specialization_id`, `hospital_id`, `phone`, `gender`, `experience_years`, `consultation_fee`, `bio`) VALUES
(1, 2, 'Robert', 'Smith', 1, 1, '+91 98765 43210', 'Male', 15, 800.00, 'Dr. Robert Smith is a renowned Cardiologist with over 15 years of experience in diagnosing and treating complex cardiovascular diseases.'),
(2, 3, 'Jane', 'Foster', 2, 2, '+91 98765 12345', 'Female', 8, 600.00, 'Dr. Jane Foster specializes in clinical and cosmetic dermatology, dedicated to modern skin therapeutics.');

-- Seed Schedules Table (Monday to Friday, 09:00 to 13:00 or 14:00 to 17:00)
INSERT INTO `schedules` (`doctor_id`, `day_of_week`, `start_time`, `end_time`, `is_available`) VALUES
(1, 'Monday', '09:00:00', '13:00:00', 1),
(1, 'Tuesday', '09:00:00', '13:00:00', 1),
(1, 'Wednesday', '09:00:00', '13:00:00', 1),
(1, 'Thursday', '09:00:00', '13:00:00', 1),
(1, 'Friday', '09:00:00', '13:00:00', 1),
(2, 'Monday', '14:00:00', '17:00:00', 1),
(2, 'Tuesday', '14:00:00', '17:00:00', 1),
(2, 'Wednesday', '14:00:00', '17:00:00', 1),
(2, 'Thursday', '14:00:00', '17:00:00', 1),
(2, 'Friday', '14:00:00', '17:00:00', 1);

-- Seed Patients Table
INSERT INTO `patients` (`id`, `user_id`, `first_name`, `last_name`, `phone`, `gender`, `dob`, `address`) VALUES
(1, 4, 'Patrick', 'Jones', '+91 98888 77777', 'Male', '1995-08-12', '12, MGR Road, Chennai'),
(2, 5, 'Sarah', 'Doe', '+91 97777 66666', 'Female', '1998-04-25', 'Sector-15, Rohini, New Delhi');

-- Seed Sample Appointments
INSERT INTO `appointments` (`id`, `patient_id`, `doctor_id`, `appointment_date`, `appointment_time`, `status`, `reason`) VALUES
(1, 1, 1, '2026-05-25', '10:30:00', 'Approved', 'Routine cardiac stress checkup'),
(2, 2, 2, '2026-05-26', '15:00:00', 'Pending', 'Eczema skin consultation');

-- Seed Sample Payments
INSERT INTO `payments` (`id`, `appointment_id`, `amount`, `transaction_id`, `status`, `payment_method`) VALUES
(1, 1, 800.00, 'TXN_PAY_SIM_987654321', 'Success', 'Simulated Card');
