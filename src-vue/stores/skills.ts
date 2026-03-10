import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Skill {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  version?: string;
  builtin?: boolean;
}

export const useSkillsStore = defineStore('skills', () => {
  const skills = ref<Skill[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadSkills = async () => {
    loading.value = true;
    try {
      const result = await window.electron.ipcRenderer.invoke('skills:list');
      skills.value = result?.skills ?? [];
    } catch (e) {
      error.value = String(e);
    } finally {
      loading.value = false;
    }
  };

  const enableSkill = async (id: string) => {
    try {
      await window.electron.ipcRenderer.invoke('skills:enable', id);
      await loadSkills();
    } catch (e) {
      error.value = String(e);
    }
  };

  const disableSkill = async (id: string) => {
    try {
      await window.electron.ipcRenderer.invoke('skills:disable', id);
      await loadSkills();
    } catch (e) {
      error.value = String(e);
    }
  };

  const installSkill = async (id: string) => {
    try {
      await window.electron.ipcRenderer.invoke('skills:install', id);
      await loadSkills();
    } catch (e) {
      error.value = String(e);
    }
  };

  const uninstallSkill = async (id: string) => {
    try {
      await window.electron.ipcRenderer.invoke('skills:uninstall', id);
      await loadSkills();
    } catch (e) {
      error.value = String(e);
    }
  };

  return {
    skills,
    loading,
    error,
    loadSkills,
    enableSkill,
    disableSkill,
    installSkill,
    uninstallSkill,
  };
});
