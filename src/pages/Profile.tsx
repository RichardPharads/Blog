import React, { useState } from 'react'
import { profileServices } from '../services/profile.services' 
import type { ProfileCreate } from '../services/profile.services'
import { useAuth } from '../hooks/AuthHook' // Use your auth hook

function Profile() {
    const { user } = useAuth() // Get user from auth hook instead
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    
    const [profileDetails, setProfileDetails] = useState<ProfileCreate>({
        username: "",
        bio: "",
        avatar_url: ""
    })

    

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setProfileDetails(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)
        
        if (!user) {
            setError("You must be logged in to update your profile")
            return
        }
        
        // Basic validation
        if (!profileDetails.username.trim()) {
            setError("Username is required")
            return
        }
        
        try {
            setIsLoading(true)
            const profile = await profileServices.createProfile(profileDetails)
            console.log("Successfully updated profile:", profile)
            setSuccess(true)
            
            // Clear form or show success message
            setTimeout(() => setSuccess(false), 3000)
            
        } catch (err: any) {
            console.error("Error updating profile:", err)
            setError(err.message || "Failed to update profile")
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading && !profileDetails.username) {
        return <div>Loading profile...</div>
    }

    return (
        <div className="profile-container">
            <h1>Profile Settings</h1>
            
            {error && (
                <div className="error-message" style={{ color: 'red', padding: '10px', margin: '10px 0', background: '#fee' }}>
                    {error}
                </div>
            )}
            
            {success && (
                <div className="success-message" style={{ color: 'green', padding: '10px', margin: '10px 0', background: '#efe' }}>
                    Profile updated successfully!
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="username">Username: *</label>
                    <input 
                        type="text" 
                        id="username"
                        name="username"
                        placeholder='Enter username' 
                        value={profileDetails.username}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="bio">Bio:</label>
                    <input 
                        type="text" 
                        id="bio"
                        name="bio"
                        placeholder='Tell us about yourself' 
                        value={profileDetails.bio}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="avatar_url">Profile Picture URL:</label>
                    <input 
                        type="text" 
                        id="avatar_url"
                        name="avatar_url"
                        placeholder='https://example.com/avatar.jpg'
                        value={profileDetails.avatar_url} 
                        onChange={handleInputChange}
                        disabled={isLoading}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                    {profileDetails.avatar_url && (
                        <div style={{ marginTop: '10px' }}>
                            <p>Preview:</p>
                            <img 
                                src={profileDetails.avatar_url} 
                                alt="Profile preview" 
                                style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/100?text=No+Image'
                                }}
                            />
                        </div>
                    )}
                </div>
                
                <button 
                    type='submit' 
                    disabled={isLoading}
                    style={{ 
                        padding: '10px 20px', 
                        background: isLoading ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLoading ? 'Saving...' : 'Save Profile'}
                </button>
            </form>
        </div>
    )
}

export default Profile