// Code generated by protoc-gen-go. DO NOT EDIT.
// source: inventory/v1/inventory.proto

package inventoryv1

import (
	context "context"
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
	math "math"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion3 // please upgrade the proto package

type ListEntitiesRequest struct {
	UriPrefix            string   `protobuf:"bytes,1,opt,name=uriPrefix,proto3" json:"uriPrefix,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *ListEntitiesRequest) Reset()         { *m = ListEntitiesRequest{} }
func (m *ListEntitiesRequest) String() string { return proto.CompactTextString(m) }
func (*ListEntitiesRequest) ProtoMessage()    {}
func (*ListEntitiesRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor_70be9028e322f9d8, []int{0}
}

func (m *ListEntitiesRequest) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_ListEntitiesRequest.Unmarshal(m, b)
}
func (m *ListEntitiesRequest) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_ListEntitiesRequest.Marshal(b, m, deterministic)
}
func (m *ListEntitiesRequest) XXX_Merge(src proto.Message) {
	xxx_messageInfo_ListEntitiesRequest.Merge(m, src)
}
func (m *ListEntitiesRequest) XXX_Size() int {
	return xxx_messageInfo_ListEntitiesRequest.Size(m)
}
func (m *ListEntitiesRequest) XXX_DiscardUnknown() {
	xxx_messageInfo_ListEntitiesRequest.DiscardUnknown(m)
}

var xxx_messageInfo_ListEntitiesRequest proto.InternalMessageInfo

func (m *ListEntitiesRequest) GetUriPrefix() string {
	if m != nil {
		return m.UriPrefix
	}
	return ""
}

type ListEntitiesReply struct {
	Entities             []*Entity `protobuf:"bytes,1,rep,name=entities,proto3" json:"entities,omitempty"`
	XXX_NoUnkeyedLiteral struct{}  `json:"-"`
	XXX_unrecognized     []byte    `json:"-"`
	XXX_sizecache        int32     `json:"-"`
}

func (m *ListEntitiesReply) Reset()         { *m = ListEntitiesReply{} }
func (m *ListEntitiesReply) String() string { return proto.CompactTextString(m) }
func (*ListEntitiesReply) ProtoMessage()    {}
func (*ListEntitiesReply) Descriptor() ([]byte, []int) {
	return fileDescriptor_70be9028e322f9d8, []int{1}
}

func (m *ListEntitiesReply) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_ListEntitiesReply.Unmarshal(m, b)
}
func (m *ListEntitiesReply) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_ListEntitiesReply.Marshal(b, m, deterministic)
}
func (m *ListEntitiesReply) XXX_Merge(src proto.Message) {
	xxx_messageInfo_ListEntitiesReply.Merge(m, src)
}
func (m *ListEntitiesReply) XXX_Size() int {
	return xxx_messageInfo_ListEntitiesReply.Size(m)
}
func (m *ListEntitiesReply) XXX_DiscardUnknown() {
	xxx_messageInfo_ListEntitiesReply.DiscardUnknown(m)
}

var xxx_messageInfo_ListEntitiesReply proto.InternalMessageInfo

func (m *ListEntitiesReply) GetEntities() []*Entity {
	if m != nil {
		return m.Entities
	}
	return nil
}

type GetEntityRequest struct {
	Entity               *Entity  `protobuf:"bytes,1,opt,name=entity,proto3" json:"entity,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *GetEntityRequest) Reset()         { *m = GetEntityRequest{} }
func (m *GetEntityRequest) String() string { return proto.CompactTextString(m) }
func (*GetEntityRequest) ProtoMessage()    {}
func (*GetEntityRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor_70be9028e322f9d8, []int{2}
}

func (m *GetEntityRequest) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_GetEntityRequest.Unmarshal(m, b)
}
func (m *GetEntityRequest) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_GetEntityRequest.Marshal(b, m, deterministic)
}
func (m *GetEntityRequest) XXX_Merge(src proto.Message) {
	xxx_messageInfo_GetEntityRequest.Merge(m, src)
}
func (m *GetEntityRequest) XXX_Size() int {
	return xxx_messageInfo_GetEntityRequest.Size(m)
}
func (m *GetEntityRequest) XXX_DiscardUnknown() {
	xxx_messageInfo_GetEntityRequest.DiscardUnknown(m)
}

var xxx_messageInfo_GetEntityRequest proto.InternalMessageInfo

func (m *GetEntityRequest) GetEntity() *Entity {
	if m != nil {
		return m.Entity
	}
	return nil
}

type GetEntityReply struct {
	Entity               *Entity  `protobuf:"bytes,1,opt,name=entity,proto3" json:"entity,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *GetEntityReply) Reset()         { *m = GetEntityReply{} }
func (m *GetEntityReply) String() string { return proto.CompactTextString(m) }
func (*GetEntityReply) ProtoMessage()    {}
func (*GetEntityReply) Descriptor() ([]byte, []int) {
	return fileDescriptor_70be9028e322f9d8, []int{3}
}

func (m *GetEntityReply) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_GetEntityReply.Unmarshal(m, b)
}
func (m *GetEntityReply) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_GetEntityReply.Marshal(b, m, deterministic)
}
func (m *GetEntityReply) XXX_Merge(src proto.Message) {
	xxx_messageInfo_GetEntityReply.Merge(m, src)
}
func (m *GetEntityReply) XXX_Size() int {
	return xxx_messageInfo_GetEntityReply.Size(m)
}
func (m *GetEntityReply) XXX_DiscardUnknown() {
	xxx_messageInfo_GetEntityReply.DiscardUnknown(m)
}

var xxx_messageInfo_GetEntityReply proto.InternalMessageInfo

func (m *GetEntityReply) GetEntity() *Entity {
	if m != nil {
		return m.Entity
	}
	return nil
}

type CreateEntityRequest struct {
	Entity               *Entity  `protobuf:"bytes,1,opt,name=entity,proto3" json:"entity,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *CreateEntityRequest) Reset()         { *m = CreateEntityRequest{} }
func (m *CreateEntityRequest) String() string { return proto.CompactTextString(m) }
func (*CreateEntityRequest) ProtoMessage()    {}
func (*CreateEntityRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor_70be9028e322f9d8, []int{4}
}

func (m *CreateEntityRequest) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_CreateEntityRequest.Unmarshal(m, b)
}
func (m *CreateEntityRequest) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_CreateEntityRequest.Marshal(b, m, deterministic)
}
func (m *CreateEntityRequest) XXX_Merge(src proto.Message) {
	xxx_messageInfo_CreateEntityRequest.Merge(m, src)
}
func (m *CreateEntityRequest) XXX_Size() int {
	return xxx_messageInfo_CreateEntityRequest.Size(m)
}
func (m *CreateEntityRequest) XXX_DiscardUnknown() {
	xxx_messageInfo_CreateEntityRequest.DiscardUnknown(m)
}

var xxx_messageInfo_CreateEntityRequest proto.InternalMessageInfo

func (m *CreateEntityRequest) GetEntity() *Entity {
	if m != nil {
		return m.Entity
	}
	return nil
}

type CreateEntityReply struct {
	Entity               *Entity  `protobuf:"bytes,1,opt,name=entity,proto3" json:"entity,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *CreateEntityReply) Reset()         { *m = CreateEntityReply{} }
func (m *CreateEntityReply) String() string { return proto.CompactTextString(m) }
func (*CreateEntityReply) ProtoMessage()    {}
func (*CreateEntityReply) Descriptor() ([]byte, []int) {
	return fileDescriptor_70be9028e322f9d8, []int{5}
}

func (m *CreateEntityReply) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_CreateEntityReply.Unmarshal(m, b)
}
func (m *CreateEntityReply) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_CreateEntityReply.Marshal(b, m, deterministic)
}
func (m *CreateEntityReply) XXX_Merge(src proto.Message) {
	xxx_messageInfo_CreateEntityReply.Merge(m, src)
}
func (m *CreateEntityReply) XXX_Size() int {
	return xxx_messageInfo_CreateEntityReply.Size(m)
}
func (m *CreateEntityReply) XXX_DiscardUnknown() {
	xxx_messageInfo_CreateEntityReply.DiscardUnknown(m)
}

var xxx_messageInfo_CreateEntityReply proto.InternalMessageInfo

func (m *CreateEntityReply) GetEntity() *Entity {
	if m != nil {
		return m.Entity
	}
	return nil
}

type SetFactRequest struct {
	EntityUri            string   `protobuf:"bytes,1,opt,name=entityUri,proto3" json:"entityUri,omitempty"`
	Name                 string   `protobuf:"bytes,2,opt,name=name,proto3" json:"name,omitempty"`
	Value                string   `protobuf:"bytes,3,opt,name=value,proto3" json:"value,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *SetFactRequest) Reset()         { *m = SetFactRequest{} }
func (m *SetFactRequest) String() string { return proto.CompactTextString(m) }
func (*SetFactRequest) ProtoMessage()    {}
func (*SetFactRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor_70be9028e322f9d8, []int{6}
}

func (m *SetFactRequest) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_SetFactRequest.Unmarshal(m, b)
}
func (m *SetFactRequest) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_SetFactRequest.Marshal(b, m, deterministic)
}
func (m *SetFactRequest) XXX_Merge(src proto.Message) {
	xxx_messageInfo_SetFactRequest.Merge(m, src)
}
func (m *SetFactRequest) XXX_Size() int {
	return xxx_messageInfo_SetFactRequest.Size(m)
}
func (m *SetFactRequest) XXX_DiscardUnknown() {
	xxx_messageInfo_SetFactRequest.DiscardUnknown(m)
}

var xxx_messageInfo_SetFactRequest proto.InternalMessageInfo

func (m *SetFactRequest) GetEntityUri() string {
	if m != nil {
		return m.EntityUri
	}
	return ""
}

func (m *SetFactRequest) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

func (m *SetFactRequest) GetValue() string {
	if m != nil {
		return m.Value
	}
	return ""
}

type SetFactReply struct {
	Fact                 *Fact    `protobuf:"bytes,1,opt,name=fact,proto3" json:"fact,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *SetFactReply) Reset()         { *m = SetFactReply{} }
func (m *SetFactReply) String() string { return proto.CompactTextString(m) }
func (*SetFactReply) ProtoMessage()    {}
func (*SetFactReply) Descriptor() ([]byte, []int) {
	return fileDescriptor_70be9028e322f9d8, []int{7}
}

func (m *SetFactReply) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_SetFactReply.Unmarshal(m, b)
}
func (m *SetFactReply) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_SetFactReply.Marshal(b, m, deterministic)
}
func (m *SetFactReply) XXX_Merge(src proto.Message) {
	xxx_messageInfo_SetFactReply.Merge(m, src)
}
func (m *SetFactReply) XXX_Size() int {
	return xxx_messageInfo_SetFactReply.Size(m)
}
func (m *SetFactReply) XXX_DiscardUnknown() {
	xxx_messageInfo_SetFactReply.DiscardUnknown(m)
}

var xxx_messageInfo_SetFactReply proto.InternalMessageInfo

func (m *SetFactReply) GetFact() *Fact {
	if m != nil {
		return m.Fact
	}
	return nil
}

type GetFactRequest struct {
	EntityUri            string   `protobuf:"bytes,1,opt,name=entityUri,proto3" json:"entityUri,omitempty"`
	Name                 string   `protobuf:"bytes,2,opt,name=name,proto3" json:"name,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *GetFactRequest) Reset()         { *m = GetFactRequest{} }
func (m *GetFactRequest) String() string { return proto.CompactTextString(m) }
func (*GetFactRequest) ProtoMessage()    {}
func (*GetFactRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor_70be9028e322f9d8, []int{8}
}

func (m *GetFactRequest) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_GetFactRequest.Unmarshal(m, b)
}
func (m *GetFactRequest) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_GetFactRequest.Marshal(b, m, deterministic)
}
func (m *GetFactRequest) XXX_Merge(src proto.Message) {
	xxx_messageInfo_GetFactRequest.Merge(m, src)
}
func (m *GetFactRequest) XXX_Size() int {
	return xxx_messageInfo_GetFactRequest.Size(m)
}
func (m *GetFactRequest) XXX_DiscardUnknown() {
	xxx_messageInfo_GetFactRequest.DiscardUnknown(m)
}

var xxx_messageInfo_GetFactRequest proto.InternalMessageInfo

func (m *GetFactRequest) GetEntityUri() string {
	if m != nil {
		return m.EntityUri
	}
	return ""
}

func (m *GetFactRequest) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

type GetFactReply struct {
	Fact                 *Fact    `protobuf:"bytes,1,opt,name=fact,proto3" json:"fact,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *GetFactReply) Reset()         { *m = GetFactReply{} }
func (m *GetFactReply) String() string { return proto.CompactTextString(m) }
func (*GetFactReply) ProtoMessage()    {}
func (*GetFactReply) Descriptor() ([]byte, []int) {
	return fileDescriptor_70be9028e322f9d8, []int{9}
}

func (m *GetFactReply) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_GetFactReply.Unmarshal(m, b)
}
func (m *GetFactReply) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_GetFactReply.Marshal(b, m, deterministic)
}
func (m *GetFactReply) XXX_Merge(src proto.Message) {
	xxx_messageInfo_GetFactReply.Merge(m, src)
}
func (m *GetFactReply) XXX_Size() int {
	return xxx_messageInfo_GetFactReply.Size(m)
}
func (m *GetFactReply) XXX_DiscardUnknown() {
	xxx_messageInfo_GetFactReply.DiscardUnknown(m)
}

var xxx_messageInfo_GetFactReply proto.InternalMessageInfo

func (m *GetFactReply) GetFact() *Fact {
	if m != nil {
		return m.Fact
	}
	return nil
}

type Entity struct {
	Uri                  string   `protobuf:"bytes,1,opt,name=uri,proto3" json:"uri,omitempty"`
	Facts                []*Fact  `protobuf:"bytes,2,rep,name=facts,proto3" json:"facts,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *Entity) Reset()         { *m = Entity{} }
func (m *Entity) String() string { return proto.CompactTextString(m) }
func (*Entity) ProtoMessage()    {}
func (*Entity) Descriptor() ([]byte, []int) {
	return fileDescriptor_70be9028e322f9d8, []int{10}
}

func (m *Entity) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Entity.Unmarshal(m, b)
}
func (m *Entity) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Entity.Marshal(b, m, deterministic)
}
func (m *Entity) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Entity.Merge(m, src)
}
func (m *Entity) XXX_Size() int {
	return xxx_messageInfo_Entity.Size(m)
}
func (m *Entity) XXX_DiscardUnknown() {
	xxx_messageInfo_Entity.DiscardUnknown(m)
}

var xxx_messageInfo_Entity proto.InternalMessageInfo

func (m *Entity) GetUri() string {
	if m != nil {
		return m.Uri
	}
	return ""
}

func (m *Entity) GetFacts() []*Fact {
	if m != nil {
		return m.Facts
	}
	return nil
}

type Fact struct {
	Name                 string   `protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`
	Value                string   `protobuf:"bytes,2,opt,name=value,proto3" json:"value,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *Fact) Reset()         { *m = Fact{} }
func (m *Fact) String() string { return proto.CompactTextString(m) }
func (*Fact) ProtoMessage()    {}
func (*Fact) Descriptor() ([]byte, []int) {
	return fileDescriptor_70be9028e322f9d8, []int{11}
}

func (m *Fact) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Fact.Unmarshal(m, b)
}
func (m *Fact) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Fact.Marshal(b, m, deterministic)
}
func (m *Fact) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Fact.Merge(m, src)
}
func (m *Fact) XXX_Size() int {
	return xxx_messageInfo_Fact.Size(m)
}
func (m *Fact) XXX_DiscardUnknown() {
	xxx_messageInfo_Fact.DiscardUnknown(m)
}

var xxx_messageInfo_Fact proto.InternalMessageInfo

func (m *Fact) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

func (m *Fact) GetValue() string {
	if m != nil {
		return m.Value
	}
	return ""
}

func init() {
	proto.RegisterType((*ListEntitiesRequest)(nil), "spotify.backstage.inventory.v1.ListEntitiesRequest")
	proto.RegisterType((*ListEntitiesReply)(nil), "spotify.backstage.inventory.v1.ListEntitiesReply")
	proto.RegisterType((*GetEntityRequest)(nil), "spotify.backstage.inventory.v1.GetEntityRequest")
	proto.RegisterType((*GetEntityReply)(nil), "spotify.backstage.inventory.v1.GetEntityReply")
	proto.RegisterType((*CreateEntityRequest)(nil), "spotify.backstage.inventory.v1.CreateEntityRequest")
	proto.RegisterType((*CreateEntityReply)(nil), "spotify.backstage.inventory.v1.CreateEntityReply")
	proto.RegisterType((*SetFactRequest)(nil), "spotify.backstage.inventory.v1.SetFactRequest")
	proto.RegisterType((*SetFactReply)(nil), "spotify.backstage.inventory.v1.SetFactReply")
	proto.RegisterType((*GetFactRequest)(nil), "spotify.backstage.inventory.v1.GetFactRequest")
	proto.RegisterType((*GetFactReply)(nil), "spotify.backstage.inventory.v1.GetFactReply")
	proto.RegisterType((*Entity)(nil), "spotify.backstage.inventory.v1.Entity")
	proto.RegisterType((*Fact)(nil), "spotify.backstage.inventory.v1.Fact")
}

func init() { proto.RegisterFile("inventory/v1/inventory.proto", fileDescriptor_70be9028e322f9d8) }

var fileDescriptor_70be9028e322f9d8 = []byte{
	// 428 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xac, 0x55, 0x4f, 0x6b, 0xe2, 0x40,
	0x14, 0x27, 0x1a, 0xdd, 0xcd, 0xd3, 0x15, 0x1d, 0xf7, 0x10, 0x44, 0x16, 0x09, 0xcb, 0xe2, 0x61,
	0x89, 0x46, 0x2f, 0xcb, 0x1e, 0x7a, 0xb0, 0xb4, 0x69, 0xa1, 0x07, 0x89, 0xd8, 0x96, 0xde, 0xa2,
	0x8c, 0x32, 0x54, 0x13, 0x9b, 0x4c, 0x42, 0xf3, 0xdd, 0xfa, 0xe1, 0xca, 0x4c, 0xe2, 0x18, 0x5b,
	0x69, 0x22, 0x7a, 0xcb, 0xbc, 0x37, 0xbf, 0x3f, 0xf3, 0x66, 0x7e, 0x04, 0xda, 0xc4, 0x09, 0xb1,
	0x43, 0x5d, 0x2f, 0xea, 0x85, 0x46, 0x4f, 0x2c, 0xf4, 0x8d, 0xe7, 0x52, 0x17, 0xfd, 0xf2, 0x37,
	0x2e, 0x25, 0x8b, 0x48, 0x9f, 0xd9, 0xf3, 0x67, 0x9f, 0xda, 0x4b, 0xac, 0xef, 0xb6, 0x84, 0x86,
	0x36, 0x84, 0xe6, 0x1d, 0xf1, 0xe9, 0x95, 0x43, 0x09, 0x25, 0xd8, 0xb7, 0xf0, 0x4b, 0x80, 0x7d,
	0x8a, 0xda, 0xa0, 0x04, 0x1e, 0x19, 0x7b, 0x78, 0x41, 0x5e, 0x55, 0xa9, 0x23, 0x75, 0x15, 0x6b,
	0x57, 0xd0, 0x1e, 0xa0, 0xb1, 0x0f, 0xda, 0xac, 0x22, 0x34, 0x82, 0xef, 0x38, 0x29, 0xa8, 0x52,
	0xa7, 0xd8, 0xad, 0x0c, 0xfe, 0xe8, 0x5f, 0x8b, 0xeb, 0x9c, 0x20, 0xb2, 0x04, 0x4e, 0xb3, 0xa0,
	0x6e, 0x62, 0x9a, 0x94, 0x13, 0x2b, 0x17, 0x50, 0xe6, 0xfd, 0x88, 0xfb, 0xc8, 0xcf, 0x9a, 0xa0,
	0xb4, 0x31, 0xd4, 0x52, 0x9c, 0xcc, 0xe9, 0xa9, 0x8c, 0x53, 0x68, 0x5e, 0x7a, 0xd8, 0xa6, 0xf8,
	0xbc, 0x46, 0x27, 0xd0, 0xd8, 0xa7, 0x3d, 0x87, 0xd7, 0x47, 0xa8, 0x4d, 0x30, 0xbd, 0xb6, 0xe7,
	0x34, 0x75, 0xb5, 0x71, 0x6f, 0xea, 0x91, 0xed, 0xd5, 0x8a, 0x02, 0x42, 0x20, 0x3b, 0xf6, 0x1a,
	0xab, 0x05, 0xde, 0xe0, 0xdf, 0xe8, 0x27, 0x94, 0x42, 0x7b, 0x15, 0x60, 0xb5, 0xc8, 0x8b, 0xf1,
	0x42, 0xbb, 0x81, 0xaa, 0x60, 0x66, 0x4e, 0xff, 0x81, 0xbc, 0xb0, 0xe7, 0x34, 0xf1, 0xf9, 0x3b,
	0xcb, 0x27, 0x07, 0x72, 0x84, 0x36, 0xe2, 0x37, 0x74, 0x92, 0x47, 0xe6, 0xc6, 0x3c, 0x8f, 0x9b,
	0x7b, 0x28, 0xc7, 0x33, 0x44, 0x75, 0x28, 0x06, 0x42, 0x9f, 0x7d, 0xa2, 0xff, 0x50, 0x62, 0x7b,
	0x7c, 0xb5, 0xc0, 0x1f, 0x78, 0x3e, 0xda, 0x18, 0xa2, 0xf5, 0x41, 0x66, 0x4b, 0xe1, 0x5e, 0x3a,
	0x34, 0xe1, 0x42, 0x6a, 0xc2, 0x83, 0x37, 0x19, 0x94, 0xdb, 0x2d, 0x1d, 0x0a, 0xa1, 0x9a, 0x0e,
	0x1d, 0x1a, 0x66, 0x89, 0x1f, 0xc8, 0x75, 0xcb, 0x38, 0x0e, 0xc4, 0x26, 0xb9, 0x06, 0x45, 0xe4,
	0x07, 0xf5, 0xb3, 0xf0, 0x1f, 0xe3, 0xdb, 0xd2, 0x8f, 0x40, 0x30, 0xb9, 0x10, 0xaa, 0xe9, 0x14,
	0x64, 0x1f, 0xf3, 0x40, 0x14, 0xb3, 0x8f, 0xf9, 0x39, 0x68, 0x4b, 0xf8, 0x96, 0x3c, 0x67, 0x94,
	0x69, 0x79, 0x3f, 0x51, 0xad, 0xbf, 0xb9, 0xf7, 0x27, 0x42, 0x66, 0x5e, 0x21, 0xf3, 0x48, 0xa1,
	0x74, 0x04, 0x46, 0x3f, 0x9e, 0x2a, 0xa2, 0x19, 0x1a, 0xb3, 0x32, 0xff, 0x21, 0x0c, 0xdf, 0x03,
	0x00, 0x00, 0xff, 0xff, 0xce, 0x45, 0x7f, 0xc5, 0x30, 0x06, 0x00, 0x00,
}

// Reference imports to suppress errors if they are not otherwise used.
var _ context.Context
var _ grpc.ClientConnInterface

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
const _ = grpc.SupportPackageIsVersion6

// InventoryClient is the client API for Inventory service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://godoc.org/google.golang.org/grpc#ClientConn.NewStream.
type InventoryClient interface {
	ListEntities(ctx context.Context, in *ListEntitiesRequest, opts ...grpc.CallOption) (*ListEntitiesReply, error)
	GetEntity(ctx context.Context, in *GetEntityRequest, opts ...grpc.CallOption) (*GetEntityReply, error)
	CreateEntity(ctx context.Context, in *CreateEntityRequest, opts ...grpc.CallOption) (*CreateEntityReply, error)
	SetFact(ctx context.Context, in *SetFactRequest, opts ...grpc.CallOption) (*SetFactReply, error)
	GetFact(ctx context.Context, in *GetFactRequest, opts ...grpc.CallOption) (*GetFactReply, error)
}

type inventoryClient struct {
	cc grpc.ClientConnInterface
}

func NewInventoryClient(cc grpc.ClientConnInterface) InventoryClient {
	return &inventoryClient{cc}
}

func (c *inventoryClient) ListEntities(ctx context.Context, in *ListEntitiesRequest, opts ...grpc.CallOption) (*ListEntitiesReply, error) {
	out := new(ListEntitiesReply)
	err := c.cc.Invoke(ctx, "/spotify.backstage.inventory.v1.Inventory/ListEntities", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *inventoryClient) GetEntity(ctx context.Context, in *GetEntityRequest, opts ...grpc.CallOption) (*GetEntityReply, error) {
	out := new(GetEntityReply)
	err := c.cc.Invoke(ctx, "/spotify.backstage.inventory.v1.Inventory/GetEntity", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *inventoryClient) CreateEntity(ctx context.Context, in *CreateEntityRequest, opts ...grpc.CallOption) (*CreateEntityReply, error) {
	out := new(CreateEntityReply)
	err := c.cc.Invoke(ctx, "/spotify.backstage.inventory.v1.Inventory/CreateEntity", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *inventoryClient) SetFact(ctx context.Context, in *SetFactRequest, opts ...grpc.CallOption) (*SetFactReply, error) {
	out := new(SetFactReply)
	err := c.cc.Invoke(ctx, "/spotify.backstage.inventory.v1.Inventory/SetFact", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *inventoryClient) GetFact(ctx context.Context, in *GetFactRequest, opts ...grpc.CallOption) (*GetFactReply, error) {
	out := new(GetFactReply)
	err := c.cc.Invoke(ctx, "/spotify.backstage.inventory.v1.Inventory/GetFact", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// InventoryServer is the server API for Inventory service.
type InventoryServer interface {
	ListEntities(context.Context, *ListEntitiesRequest) (*ListEntitiesReply, error)
	GetEntity(context.Context, *GetEntityRequest) (*GetEntityReply, error)
	CreateEntity(context.Context, *CreateEntityRequest) (*CreateEntityReply, error)
	SetFact(context.Context, *SetFactRequest) (*SetFactReply, error)
	GetFact(context.Context, *GetFactRequest) (*GetFactReply, error)
}

// UnimplementedInventoryServer can be embedded to have forward compatible implementations.
type UnimplementedInventoryServer struct {
}

func (*UnimplementedInventoryServer) ListEntities(ctx context.Context, req *ListEntitiesRequest) (*ListEntitiesReply, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListEntities not implemented")
}
func (*UnimplementedInventoryServer) GetEntity(ctx context.Context, req *GetEntityRequest) (*GetEntityReply, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetEntity not implemented")
}
func (*UnimplementedInventoryServer) CreateEntity(ctx context.Context, req *CreateEntityRequest) (*CreateEntityReply, error) {
	return nil, status.Errorf(codes.Unimplemented, "method CreateEntity not implemented")
}
func (*UnimplementedInventoryServer) SetFact(ctx context.Context, req *SetFactRequest) (*SetFactReply, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SetFact not implemented")
}
func (*UnimplementedInventoryServer) GetFact(ctx context.Context, req *GetFactRequest) (*GetFactReply, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetFact not implemented")
}

func RegisterInventoryServer(s *grpc.Server, srv InventoryServer) {
	s.RegisterService(&_Inventory_serviceDesc, srv)
}

func _Inventory_ListEntities_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListEntitiesRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(InventoryServer).ListEntities(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/spotify.backstage.inventory.v1.Inventory/ListEntities",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(InventoryServer).ListEntities(ctx, req.(*ListEntitiesRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Inventory_GetEntity_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetEntityRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(InventoryServer).GetEntity(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/spotify.backstage.inventory.v1.Inventory/GetEntity",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(InventoryServer).GetEntity(ctx, req.(*GetEntityRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Inventory_CreateEntity_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CreateEntityRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(InventoryServer).CreateEntity(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/spotify.backstage.inventory.v1.Inventory/CreateEntity",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(InventoryServer).CreateEntity(ctx, req.(*CreateEntityRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Inventory_SetFact_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(SetFactRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(InventoryServer).SetFact(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/spotify.backstage.inventory.v1.Inventory/SetFact",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(InventoryServer).SetFact(ctx, req.(*SetFactRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Inventory_GetFact_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetFactRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(InventoryServer).GetFact(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/spotify.backstage.inventory.v1.Inventory/GetFact",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(InventoryServer).GetFact(ctx, req.(*GetFactRequest))
	}
	return interceptor(ctx, in, info, handler)
}

var _Inventory_serviceDesc = grpc.ServiceDesc{
	ServiceName: "spotify.backstage.inventory.v1.Inventory",
	HandlerType: (*InventoryServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "ListEntities",
			Handler:    _Inventory_ListEntities_Handler,
		},
		{
			MethodName: "GetEntity",
			Handler:    _Inventory_GetEntity_Handler,
		},
		{
			MethodName: "CreateEntity",
			Handler:    _Inventory_CreateEntity_Handler,
		},
		{
			MethodName: "SetFact",
			Handler:    _Inventory_SetFact_Handler,
		},
		{
			MethodName: "GetFact",
			Handler:    _Inventory_GetFact_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "inventory/v1/inventory.proto",
}
