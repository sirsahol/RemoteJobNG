from rest_framework import serializers
from .models import User, UserSkill
from categories.serializers import SkillTagSerializer


class UserPublicSerializer(serializers.ModelSerializer):
    skills = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'slug', 'first_name', 'last_name',
            'headline', 'bio', 'location', 'role', 'availability',
            'company_name', 'profile_picture', 'website',
            'github_url', 'linkedin_url', 'twitter_url',
            'skills', 'created_at',
        ]

    def get_skills(self, obj):
        return UserSkillSerializer(obj.skills.all(), many=True).data


class UserPrivateSerializer(serializers.ModelSerializer):
    skills = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'slug', 'email', 'first_name', 'last_name',
            'headline', 'bio', 'location', 'role', 'availability',
            'phone', 'company_name', 'profile_picture',
            'is_profile_public', 'website',
            'github_url', 'linkedin_url', 'twitter_url',
            'skills', 'created_at', 'updated_at',
        ]

    def get_skills(self, obj):
        return UserSkillSerializer(obj.skills.all(), many=True).data


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'role']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserSkillSerializer(serializers.ModelSerializer):
    skill_tag_detail = SkillTagSerializer(source='skill_tag', read_only=True)

    class Meta:
        model = UserSkill
        fields = ['id', 'skill_tag', 'skill_tag_detail', 'name', 'proficiency']
