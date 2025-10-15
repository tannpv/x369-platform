package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"notification-service/internal/domain"

	"github.com/gorilla/mux"
)

type NotificationHandler struct {
	notificationUseCase domain.NotificationUseCase
}

func NewNotificationHandler(notificationUseCase domain.NotificationUseCase) *NotificationHandler {
	return &NotificationHandler{
		notificationUseCase: notificationUseCase,
	}
}

func (h *NotificationHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/notifications", h.CreateNotification).Methods("POST")
	router.HandleFunc("/notifications", h.ListNotifications).Methods("GET")
	router.HandleFunc("/notifications/{id}", h.GetNotification).Methods("GET")
	router.HandleFunc("/notifications/{id}", h.UpdateNotification).Methods("PUT")
	router.HandleFunc("/notifications/{id}", h.DeleteNotification).Methods("DELETE")
	router.HandleFunc("/notifications/{id}/read", h.MarkAsRead).Methods("POST")
	router.HandleFunc("/notifications/send-pending", h.SendPendingNotifications).Methods("POST")
	router.HandleFunc("/notifications/stats", h.GetNotificationStats).Methods("GET")
	router.HandleFunc("/users/{userId}/notifications", h.GetUserNotifications).Methods("GET")
	router.HandleFunc("/users/{userId}/notifications/unread", h.GetUnreadNotifications).Methods("GET")
	router.HandleFunc("/users/{userId}/notifications/mark-all-read", h.MarkAllAsRead).Methods("POST")
}

func (h *NotificationHandler) CreateNotification(w http.ResponseWriter, r *http.Request) {
	var req domain.CreateNotificationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	notification, err := h.notificationUseCase.CreateNotification(r.Context(), &req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(notification)
}

func (h *NotificationHandler) GetNotification(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	notification, err := h.notificationUseCase.GetNotification(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(notification)
}

func (h *NotificationHandler) UpdateNotification(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var req domain.UpdateNotificationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	notification, err := h.notificationUseCase.UpdateNotification(r.Context(), id, &req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(notification)
}

func (h *NotificationHandler) DeleteNotification(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	err := h.notificationUseCase.DeleteNotification(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *NotificationHandler) ListNotifications(w http.ResponseWriter, r *http.Request) {
	filter := &domain.NotificationFilter{}

	// Parse query parameters
	if userID := r.URL.Query().Get("user_id"); userID != "" {
		filter.UserID = &userID
	}
	if notificationType := r.URL.Query().Get("type"); notificationType != "" {
		nt := domain.NotificationType(notificationType)
		filter.Type = &nt
	}
	if status := r.URL.Query().Get("status"); status != "" {
		ns := domain.NotificationStatus(status)
		filter.Status = &ns
	}
	if priority := r.URL.Query().Get("priority"); priority != "" {
		np := domain.NotificationPriority(priority)
		filter.Priority = &np
	}
	if unread := r.URL.Query().Get("unread"); unread == "true" {
		filter.Unread = &[]bool{true}[0]
	}

	if limit, err := strconv.Atoi(r.URL.Query().Get("limit")); err == nil {
		filter.Limit = limit
	} else {
		filter.Limit = 20
	}

	if offset, err := strconv.Atoi(r.URL.Query().Get("offset")); err == nil {
		filter.Offset = offset
	}

	response, err := h.notificationUseCase.ListNotifications(r.Context(), filter)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *NotificationHandler) GetUserNotifications(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["userId"]

	limit := 20
	offset := 0

	if l, err := strconv.Atoi(r.URL.Query().Get("limit")); err == nil {
		limit = l
	}
	if o, err := strconv.Atoi(r.URL.Query().Get("offset")); err == nil {
		offset = o
	}

	notifications, err := h.notificationUseCase.GetUserNotifications(r.Context(), userID, limit, offset)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(notifications)
}

func (h *NotificationHandler) GetUnreadNotifications(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["userId"]

	notifications, err := h.notificationUseCase.GetUnreadNotifications(r.Context(), userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(notifications)
}

func (h *NotificationHandler) MarkAsRead(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	userID := r.Header.Get("X-User-ID") // Get from auth header/middleware

	if userID == "" {
		http.Error(w, "User ID required", http.StatusUnauthorized)
		return
	}

	err := h.notificationUseCase.MarkAsRead(r.Context(), id, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *NotificationHandler) MarkAllAsRead(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["userId"]

	err := h.notificationUseCase.MarkAllAsRead(r.Context(), userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *NotificationHandler) SendPendingNotifications(w http.ResponseWriter, r *http.Request) {
	err := h.notificationUseCase.SendPendingNotifications(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *NotificationHandler) GetNotificationStats(w http.ResponseWriter, r *http.Request) {
	var userID *string
	if uid := r.URL.Query().Get("user_id"); uid != "" {
		userID = &uid
	}

	stats, err := h.notificationUseCase.GetNotificationStats(r.Context(), userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}
