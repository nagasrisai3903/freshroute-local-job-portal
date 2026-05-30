from rest_framework import serializers
from .models import Job


class JobSerializer(serializers.ModelSerializer):
    skills_list = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = '__all__'

    def get_skills_list(self, obj):
        if not obj.skills_required:
            return []
        return [skill.strip() for skill in obj.skills_required.split(',')]