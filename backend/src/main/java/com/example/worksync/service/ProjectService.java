package com.example.worksync.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.worksync.dto.requests.ProjectDTO;
import com.example.worksync.model.Project;
import com.example.worksync.repository.ProjectRepository;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<ProjectDTO> listProjects() {
        List<Project> projects = projectRepository.findAll();
        return projects.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<ProjectDTO> findById(Long id) {
        return projectRepository.findById(id).map(this::convertToDTO);
    }

    public ProjectDTO createProject(ProjectDTO dto) {
        Project project = convertToEntity(dto);
        project = projectRepository.save(project);
        return convertToDTO(project);
    }

    public ProjectDTO updateProject(Long id, ProjectDTO dto) {
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("Project not found!");
        }
        Project project = convertToEntity(dto);
        project.setId(id);
        project = projectRepository.save(project);
        return convertToDTO(project);
    }

    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("Project not found!");
        }
        projectRepository.deleteById(id);
    }

    public ProjectDTO addParticipantToProject(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found!"));

        if (!project.getParticipantIds().contains(userId)) {
            project.getParticipantIds().add(userId);
            project = projectRepository.save(project);
        } else {
            throw new RuntimeException("User is already a participant of this project!");
        }

        return convertToDTO(project);
    }

    private ProjectDTO convertToDTO(Project project) {
        return new ProjectDTO(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getParticipantIds() != null ? project.getParticipantIds() : List.of(),
                project.getTaskIds() != null ? project.getTaskIds() : List.of()
        );
    }

    private Project convertToEntity(ProjectDTO dto) {
        Project project = new Project();
        project.setTitle(dto.getTitle());
        project.setDescription(dto.getDescription());
        project.setParticipantIds(dto.getParticipantIds());
        project.setTaskIds(dto.getTaskIds());
        return project;
    }
}
