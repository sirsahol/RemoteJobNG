from rest_framework import serializers
from .models import User, UserSkill


class UserSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSkill
        fields = ['id', 'skill_name', 'proficiency']


class UserPublicSerializer(serializers.ModelSerializer):
    """Safe read-only serializer for public profile display."""
    skills = UserSkillSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'profile_slug', 'role', 'headline', 'bio',
            'location', 'profile_picture', 'company_name', 'company_website',
            'company_logo', 'company_size', 'is_verified_employer',
            'years_experience', 'linkedin_url', 'portfolio_url', 'github_url',
            'resume_url', 'availability', 'is_profile_public', 'skills',
            'created_at',
        ]
        read_only_fields = ['id', 'username', 'profile_slug', 'created_at']


class UserPrivateSerializer(serializers.ModelSerializer):
    """Full serializer for authenticated user accessing their own profile."""
    skills = UserSkillSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'profile_slug', 'role', 'phone', 'headline', 'bio',
            'location', 'profile_picture', 'company_name', 'company_website',
            'company_logo', 'company_size', 'is_verified_employer',
            'years_experience', 'linkedin_url', 'portfolio_url', 'github_url',
            'resume_url', 'availability', 'is_profile_public', 'skills',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'username', 'profile_slug', 'role', 'is_verified_employer', 'created_at', 'updated_at']
        # CRITICAL: never include 'password' in any serializer fields list


class UserCreateSerializer(serializers.ModelSerializer):
    """Registration serializer."""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'role', 'first_name', 'last_name']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
