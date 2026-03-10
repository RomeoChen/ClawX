<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { NCard, NButton, NSwitch, NEmpty, NSpin, NGrid, NGi, NIcon, NTag } from 'naive-ui';
import { Puzzle, CheckmarkCircle, CloseCircle, Download, Trash } from '@vicons/ionicons5';
import { useSkillsStore } from '@/stores/skills';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const skillsStore = useSkillsStore();

const skills = computed(() => skillsStore.skills);
const loading = computed(() => skillsStore.loading);

const handleToggle = async (skill: any) => {
  if (skill.enabled) {
    await skillsStore.disableSkill(skill.id);
  } else {
    await skillsStore.enableSkill(skill.id);
  }
};

onMounted(async () => {
  await skillsStore.loadSkills();
});
</script>

<template>
  <div class="skills-page">
    <div class="page-header">
      <h1>{{ t('skills.title', 'Skills') }}</h1>
      <p class="page-description">{{ t('skills.description', 'Manage AI skills and capabilities') }}</p>
    </div>

    <NSpin :show="loading">
      <NEmpty v-if="!loading && skills.length === 0" :description="t('skills.empty', 'No skills available')" />
      
      <NGrid v-else :cols="3" :x-gap="16" :y-gap="16">
        <NGi v-for="skill in skills" :key="skill.id">
          <NCard class="skill-card">
            <div class="skill-header">
              <NIcon :component="Puzzle" size="24" />
              <div class="skill-info">
                <h3>{{ skill.name }}</h3>
                <span class="skill-version" v-if="skill.version">v{{ skill.version }}</span>
              </div>
              <NSwitch :value="skill.enabled" @update:value="handleToggle(skill)" />
            </div>
            
            <p class="skill-description">{{ skill.description }}</p>
            
            <div class="skill-footer">
              <NTag v-if="skill.builtin" size="small" type="info">
                {{ t('skills.builtin', 'Built-in') }}
              </NTag>
              <div class="skill-status">
                <NIcon v-if="skill.enabled" :component="CheckmarkCircle" class="status-enabled" />
                <NIcon v-else :component="CloseCircle" class="status-disabled" />
                <span>{{ skill.enabled ? t('skills.enabled', 'Enabled') : t('skills.disabled', 'Disabled') }}</span>
              </div>
            </div>
          </NCard>
        </NGi>
      </NGrid>
    </NSpin>
  </div>
</template>

<style scoped>
.skills-page {
  max-width: 1200px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.page-description {
  color: var(--n-text-color-3);
}

.skill-card {
  height: 100%;
}

.skill-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.skill-info {
  flex: 1;
}

.skill-info h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 2px;
}

.skill-version {
  font-size: 0.75rem;
  color: var(--n-text-color-3);
}

.skill-description {
  font-size: 0.875rem;
  color: var(--n-text-color-3);
  margin-bottom: 16px;
  line-height: 1.5;
}

.skill-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.skill-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
}

.status-enabled {
  color: #22c55e;
}

.status-disabled {
  color: #6b7280;
}
</style>
